export class Form {
  constructor(
    public kind: any,
    public namespace: any,
    public value: any,
    public openChr = '',
    public closeChr = '',
    public terminal = true,
    public quoted = false
  ) {
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
        .map((t: Form) => {
          try {
            return t.stringify();
          } catch (e) {
            return t;
          }
        })
        .join(' ');
    }

    return `${this.openChr || ''}${value}${this.closeChr || ''}`;
  }

  isTerminal() {
    return this.terminal !== false;
  }

  toString() {
    return this.stringify();
  }
}
