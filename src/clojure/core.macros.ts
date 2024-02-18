import { Evaluator } from '../evaluator';
import { NamespaceRegistry } from '../namespace_registry';

export class CoreMacros {
  private evaluator: Evaluator;
  private namespaceRegistry: NamespaceRegistry;

  constructor(evaluator: Evaluator, namespaceRegistry: NamespaceRegistry) {
    this.evaluator = evaluator;
    this.namespaceRegistry = namespaceRegistry;
  }

  defmacro(name, params, list) {
    const context = this.namespaceRegistry.getCurrent();

    const f = function () {
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
      return this.evaluator.evaluate([expandedList], context);
    }.bind(this);

    function macro() {
      return f.apply(context, arguments);
    }
    macro.macro = true;
    this.namespaceRegistry.getCurrent().set(name.value, macro);
  }

  assert(condition) {
    function errorString(condition, extrainfo?) {
      return (
        'Assert failed: ' +
        condition.stringify() +
        (extrainfo !== undefined ? '; ' + extrainfo : '')
      );
    }

    try {
      if (this.evaluator.evaluate([condition]).value !== true) {
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

  functions() {
    const defmacro = this.defmacro.bind(this);
    defmacro.macro = true;
    const assert = this.assert.bind(this);
    assert.macro = true;

    return {
      defmacro: defmacro,
      assert: assert,
    };
  }
}
