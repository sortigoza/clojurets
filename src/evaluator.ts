import { events, EventType } from './events';
import { forms } from './forms';
import { Namespace } from './namespace';

const number = forms.number,
  string = forms.string,
  literal = forms.literal,
  symbol = forms.symbol,
  hash_map = forms.hash_map,
  vector = forms.vector,
  list = forms.list,
  call = forms.call,
  MAX_ITERATIONS = 1000;

class Evaluator {
  evaluate(exprs, context?) {
    context = context || Namespace.current;

    let result;
    for (const expr of exprs) {
      result = evaluateExpression(expr, context);
    }

    return result === undefined ? literal(null) : result;
  }
}

function instrumentEvents(fn, form, context) {
  try {
    events.publish(EventType.BEGIN_EVALUATE_EXPRESSION, { form, context });
    const result = fn(form, context);
    events.publish(EventType.FINISH_EVALUATE_EXPRESSION, { form, context, result });
    return result;
  } catch (e) {
    events.publish(EventType.EVALUATE_EXPRESSION_FAILED, { form, context });
    throw e;
  }
}

function evaluateExpression(form, context) {
  return instrumentEvents(_evaluateExpression, form, context);
}

function _evaluateExpression(form, context) {
  let should_continue,
    count = 0;
  while (true) {
    if (form.quoted) {
      return form;
    }

    switch (form.kind) {
      case literal.kind:
        return literal(lookupLiteral(form.value));
      case symbol.kind:
        return lookupSymbol(form.value, form.namespace, context);
      case vector.kind:
        return vector.apply(
          forms,
          form.value.map(function (e) {
            return evaluateExpression(e, context);
          })
        );
      case hash_map.kind:
        return hash_map.apply(
          forms,
          form.value.map(function (e) {
            return evaluateExpression(e, context);
          })
        );
      case call.kind:
        // handle special forms
        switch (form.value[0].value) {
          case 'if':
            form = SpecialForms.tailCallIf(form, context);
            continue;
          case 'cond':
            form = SpecialForms.tailCallCond(form, context);
            continue;
          case 'fn':
            return SpecialForms.fn(form, context);
          case 'def':
            return SpecialForms.def(form, context);
          case 'let':
            return SpecialForms.let(form, context.extend());
          case 'throw':
            return SpecialForms.throw(form, context);
          case 'try':
            return SpecialForms.try(form, context);
        }

        [form, should_continue, context] = evaluateCall(form, context.extend());
        // prevent it to be stuck in an infinite loop
        if (should_continue && count < MAX_ITERATIONS) {
          count++;
          continue;
        }
        if (count === MAX_ITERATIONS) {
          console.log({ msg: 'max evaluations reached!', count });
        }
        return form;
      default:
        return form;
    }
  }
}

// Special forms have evaluation rules that differ from standard Clojure evaluation rules
// ref. https://clojure.org/reference/special_forms
export class SpecialForms {
  // Eliminate the tail call of the if branches by "continuing the interpret loop"
  // with the branch set as the current expression
  static tailCallIf(form, context) {
    const predicate = evaluateExpression(form.value[1], context);
    if (predicate.value !== null && predicate.value !== false) {
      return form.value[2];
    } else {
      return form.value[3];
    }
  }

  // Eliminate the tail call of the if branches by "continuing the interpret loop"
  // with the branch set as the current expression
  static tailCallCond(form, context) {
    let predicate,
      exprs = form.value.slice(1);

    for (let i = 0; i < exprs.length; i = i + 2) {
      predicate = evaluateExpression(exprs[i], context);
      if (predicate.value !== null && predicate.value !== false) {
        return exprs[i + 1];
      }
    }
  }

  static fn(form, context) {
    const params = form.value[1],
      exprs = form.value[2];

    // TODO: use a form instead of a plain object
    return {
      params,
      exprs,
      program_defined: true,
      context,
      quoted: false,
    };
  }

  static def(form, context) {
    const name = form.value[1],
      init = form.value[2];

    const value = typeof init === 'undefined' ? literal(null) : evaluateExpression(init, context);
    Namespace.current.set(name.value, value);
  }

  static let(form, context) {
    const bindings = form.value[1],
      exprs = form.value[2];
    let i, param, value;

    if (bindings.value.length % 2 !== 0) {
      throw new Error('let requires an even number of forms in binding vector');
    }

    for (i = 0; i < bindings.value.length; i += 2) {
      param = bindings.value[i].value;
      value = evaluateExpression(bindings.value[i + 1], context);

      context.set(param, value);
    }

    return evaluateExpression(exprs, context);
  }

  static throw(form, context) {
    const exprs = form.value[1];
    throw new Error(evaluateExpression(exprs, context));
  }

  static try(form, context) {
    const exprs = form.value[1],
      catchClause = form.value[2],
      finallyClause = form.value[3];
    try {
      return evaluateExpression(exprs, context);
    } catch (error) {
      // will not distinguish between different exceptions
      return evaluateExpression(catchClause, context);
    } finally {
      // any finally-clause exprs will be evaluated for their side effects
      if (finallyClause !== undefined) {
        evaluateExpression(finallyClause, context);
      }
    }
  }
}

function evaluateCall(form, context) {
  let func = evaluateExpression(form.value[0], context),
    args = form.value.slice(1);

  if (!func.macro) {
    args = args.map(function (arg) {
      return evaluateExpression(arg, context);
    });
  }

  // NOTE: implements tail-recursion for program_defined procedures
  // Eliminate the tail-call of running this procedure by "continuing the interpret loop"
  // with the procedure's body set as the current expression and the procedure's closure set
  // as the current environment.
  if (func.program_defined) {
    func.params.value.map(function (arg, i) {
      context.set(arg.value, args[i]);
    });

    const exprs = func.exprs;

    // when the function does not have a body, return null
    if (exprs === undefined) {
      return [literal(null), false, context];
    }

    const lastExpression = exprs;

    // TODO: fix execution of inner expressions
    // let allButLastExpressions = exprs.slice(0, -1);
    // let lastExpression = exprs[exprs.length - 1];
    // console.log({
    //   allButLastExpressions,
    //   lastExpression,
    // });
    // for (const expr of allButLastExpressions) {
    //   evaluateExpression(expr, context.extend())
    // }

    // result, should_continue, context
    return [lastExpression, true, context];
  }

  const result = (typeof func === 'function' ? func : func.value).apply(context, args);
  // result, should_continue, context
  return [result, false, context];
}

function lookupLiteral(name) {
  if (name === 'true') return true;
  if (name === 'false') return false;
  if (name === 'nil') return null;
}

function lookupSymbol(name, namespace, context) {
  const lookups = [
    lookupQualifiedSymbol,
    lookupSpecialForm,
    lookupContextSymbol,
    lookupWindowSymbol,
    lookupGlobalSymbol,
    throwLookupError,
  ];
  let symbol;

  // use the first lookup match returning a valid value
  lookups.find(function (lookup) {
    return (symbol = lookup.call(this, name, namespace, context)) !== undefined;
  });

  return symbol;
}

function lookupQualifiedSymbol(name, namespace) {
  if (namespace === undefined) {
    return;
  }

  if (Namespace.get(namespace) === undefined) {
    throw new Error('No such namespace: ' + namespace);
  }

  return Namespace.get(namespace).get(name);
}

function lookupSpecialForm(name, namespace) {
  if (namespace !== undefined) {
    return;
  }

  const form = SpecialForms[name];

  if (typeof form === 'function') {
    return form;
  }
}

function lookupContextSymbol(name, namespace, context) {
  if (context.get(name) === undefined) {
    return;
  }

  return context.get(name);
}

function lookupWindowSymbol(name) {
  if (typeof window !== 'undefined' && window[name] !== undefined) {
    return function () {
      return window[name].apply(window, arguments);
    };
  }
}

function lookupGlobalSymbol(name) {
  if (typeof global !== 'undefined' && global[name] !== undefined) {
    return function () {
      return global[name].apply(global, arguments);
    };
  }
}

function throwLookupError(name, namespace, context) {
  if (namespace !== undefined) {
    throw new Error('No such var: ' + namespace + '/' + name);
  }

  throw new Error('Unable to resolve symbol: ' + name + ' in this context');
}

Array.prototype.map =
  Array.prototype.map ||
  function (f) {
    const result = [];
    for (let i = 0; i < this.length; ++i) {
      result.push(f(this[i], i, this));
    }

    return result;
  };

Array.prototype.find =
  Array.prototype.find ||
  function (f) {
    for (let i = 0; i < this.length; ++i) {
      if (f(this[i])) {
        return this[i];
      }
    }
  };

const evaluator = new Evaluator();
export { evaluator };
