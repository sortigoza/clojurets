import { CoreNamespaceFactory } from './clojure/core';
import { Evaluator } from './evaluator';
import { events, EventType } from './events';
import { Namespace } from './namespace';

const DEFAULT_NAMESPACE = 'user';

export class NamespaceRegistry {
  all: Record<string, Namespace> = {};
  private current: Namespace | undefined;
  private evaluator: Evaluator;
  private isInitialized = false;

  initialize(evaluator: Evaluator): void {
    this.evaluator = evaluator;
    this.isInitialized = true;
    this.reset(); // Initialize the registry with a default namespace upon creation
  }

  get(name: string): Namespace | undefined {
    return this.all[name];
  }

  set(name: string): void {
    if (!this.isInitialized) {
      throw new Error('NamespaceRegistry is not initialized');
    }

    if (!this.all[name]) {
      const namespace = new Namespace(name);
      const core = new CoreNamespaceFactory(this.evaluator, this).create();
      namespace.use(core);
      this.all[name] = namespace;
    }
    this.current = this.all[name];
  }

  reset(): void {
    this.all = {};
    this.set(DEFAULT_NAMESPACE);
    events.publish(EventType.NAMESPACES_RESET, null);
  }

  getCurrent(): Namespace | undefined {
    return this.current;
  }
}
