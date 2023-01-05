export class Form {
  kind: any;
  namespace: any;
  value: any;
  openChr: any;
  closeChr: any;
  terminal: any;
  quoted: any;

  constructor(kind, namespace, value, openChr, closeChr, terminal, stringifyRep?) {
    this.kind = kind;
    this.namespace = namespace;
    this.value = value;
    this.openChr = openChr;
    this.closeChr = closeChr;
    this.terminal = terminal;
    this.quoted = false;
  }

  // TODO: fix stringify for functions
  stringify() {
    let value;

    if (this.isTerminal()) {
      value = this.value;
    } else {
      value = this.value
        .map(function (t) {
          try {
            return t.stringify();
          } catch (e) {
            return t;
          }
        })
        .join(' ');
    }

    return (this.openChr || '') + value + (this.closeChr || '');
  }

  isTerminal() {
    return this.terminal !== false;
  }

  toString() {
    return this.stringify();
  }
}
