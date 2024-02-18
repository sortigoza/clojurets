export class Namespace {
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
}
