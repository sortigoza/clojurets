import { Evaluator, SpecialForms } from '../evaluator';

import { NamespaceRegistry } from '../namespace_registry';

export class CoreNamespace {
  private evaluator: Evaluator;
  private namespaceRegistry: NamespaceRegistry;

  constructor(evaluator: Evaluator, namespaceRegistry: NamespaceRegistry) {
    this.evaluator = evaluator;
    this.namespaceRegistry = namespaceRegistry;
  }

  ns(name) {
    this.namespaceRegistry.set(name.value);
  }

  functions() {
    const ns = this.ns.bind(this);
    ns.macro = true;

    return {
      ns: ns,
    };
  }
}
