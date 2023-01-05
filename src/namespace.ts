import { events, EventType } from './events';
import { logger } from './logger';

export class Namespace {
  static all = [];
  static current;
  name;
  vars;

  constructor(name?) {
    this.name = name;
    this.vars = {};
  }

  use(ns: Namespace) {
    let name;

    for (name in ns.vars) {
      this.set(name, ns.get(name));
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

    function Vars() {}
    Vars.prototype = this.vars;

    ns.vars = new Vars();

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
      const { core } = require('./clojure/core');
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
