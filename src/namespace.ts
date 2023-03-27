import { events, EventType } from './events';
import { logger } from './logger';

export class Namespace {
  static all: Namespace[] = [];
  static current: Namespace | undefined;
  name: string;
  vars: Record<string, any> = {};

  constructor(name?) {
    this.name = name;
    this.vars = {};
  }

  use(ns: Namespace) {
    for (const [name, value] of Object.entries(ns.vars)) {
      this.set(name, value);
    }
  }

  get(name: string) {
    return this.vars[name];
  }

  set(name: string, value) {
    this.vars[name] = value;
  }

  extend() {
    const ns = new Namespace();
    ns.vars = Object.create(this.vars);
    return ns;
  }

  // =================================
  // Namespaces Registry methods
  // =================================
  static get(name) {
    return Namespace.all[name];
  }

  static set(name) {
    if (!Namespace.all[name]) {
      const namespace = new Namespace(name);
      const { core } = require(__dirname + '/clojure/core');
      namespace.use(core);
      Namespace.all[name] = namespace;
    }

    Namespace.current = Namespace.all[name];
  }

  static reset() {
    Namespace.all = [];
    Namespace.set('user');
    events.publish(EventType.NAMESPACES_RESET, null);
  }
}

Namespace.reset();
