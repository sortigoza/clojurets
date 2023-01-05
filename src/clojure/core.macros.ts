import { evaluator } from '../evaluator';
import { Namespace } from '../namespace';

export function defmacro(name, params, list) {
  const context = this,
    f = function () {
      // expand
      const expandedList = { kind: 'call', value: [] };
      const extArgs = arguments;
      expandedList.value = list.value.map(function (expr) {
        for (let i = 0; i < params.value.length; i++) {
          const param = params.value[i];
          if (expr.value === param.value) {
            return extArgs[i];
          }
        }
        return expr;
      });

      // evalute
      return evaluator.evaluate([expandedList], context);
    };

  function macro() {
    return f.apply(context, arguments);
  }
  macro.macro = true;
  Namespace.current.set(name.value, macro);
}

defmacro.macro = true;

export function assert(condition) {
  function errorString(condition, extrainfo?) {
    return (
      'Assert failed: ' + condition.stringify() + (extrainfo !== undefined ? '; ' + extrainfo : '')
    );
  }

  try {
    if (evaluator.evaluate([condition]).value !== true) {
      const error = new Error(errorString(condition));
      // TODO: fix this!
      // error.constructedByAssert = true;
      throw error;
    }
  } catch (e) {
    // Catch other exceptions
    if (e.constructedByAssert) {
      throw e;
    }
    throw new Error(errorString(condition, e.message));
  }
}

assert.macro = true;
