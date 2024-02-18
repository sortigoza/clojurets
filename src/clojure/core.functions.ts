import { Evaluator, SpecialForms } from '../evaluator';
import { forms } from '../forms';
import { NamespaceRegistry } from '../namespace_registry';

const { literal } = forms;

export class CoreFunctions {
  private evaluator: Evaluator;
  private namespaceRegistry: NamespaceRegistry;

  constructor(evaluator: Evaluator, namespaceRegistry: NamespaceRegistry) {
    this.evaluator = evaluator;
    this.namespaceRegistry = namespaceRegistry;
  }

  partial(func: Function, ...args: any[]) {
    return function (this: any, ...rest: any[]) {
      const context = this;
      const allArgs = [...args, ...rest];

      const result = func.apply(context, allArgs);
      if (result == null) {
        return literal(null);
      }
      return result;
    };
  }

  defn(name: any, args: any, exprs: any) {
    const context = this.namespaceRegistry.getCurrent();
    context.set(name.value, SpecialForms.fn({ value: ['', args, exprs] }, context));
  }

  functions() {
    const defn = this.defn.bind(this);
    defn.macro = true;

    return {
      partial: this.partial.bind(this),
      defn: defn,
    };
  }
}
