import { Evaluator } from '../evaluator';
import { Namespace } from '../namespace';
import { NamespaceRegistry } from '../namespace_registry';
import { maps } from './core.collections.hash_maps';
import { CoreCollectionsLists } from './core.collections.lists';
import { CoreFunctions } from './core.functions';
import * as coreIO from './core.io';
import { CoreMacros } from './core.macros';
import { misc } from './core.misc';
import { CoreNamespace } from './core.namespace';
import { arithmetic } from './core.primitives.numbers.arithmetic';
import { numbers_test } from './core.primitives.numbers.checks';
import * as sequences from './core.sequences';

const core_namespace_name = 'clojure.core';

export class CoreNamespaceFactory {
  private evaluator: Evaluator;
  private namespaceRegistry: NamespaceRegistry;

  constructor(evaluator: Evaluator, namespaceRegistry: NamespaceRegistry) {
    this.evaluator = evaluator;
    this.namespaceRegistry = namespaceRegistry;
  }

  create(): Namespace {
    const core = new Namespace(core_namespace_name);

    function use(vars) {
      for (const name in vars) {
        core.set(name, vars[name]);
      }
    }

    // raise Error is this.evaluator is undefined
    if (!this.evaluator) {
      throw new Error('Evaluator is required to create core namespace');
    }

    // Based on http://clojure.org/cheatsheet
    use(new CoreCollectionsLists(this.evaluator, this.namespaceRegistry).functions());
    use(arithmetic);
    use(numbers_test);
    use(new CoreFunctions(this.evaluator, this.namespaceRegistry).functions());
    use(sequences);
    use(misc);
    use(new CoreMacros(this.evaluator, this.namespaceRegistry).functions());
    use(coreIO);
    use(new CoreNamespace(this.evaluator, this.namespaceRegistry).functions());
    use(maps);

    return core;
  }
}
