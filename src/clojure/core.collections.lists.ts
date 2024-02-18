import { Evaluator } from '../evaluator';
import { forms } from '../forms';
import { NamespaceRegistry } from '../namespace_registry';

export class CoreCollectionsLists {
  private evaluator: Evaluator;

  constructor(evaluator: Evaluator, namespaceRegistry: NamespaceRegistry) {
    this.evaluator = evaluator;
  }

  first(list) {
    return this.evaluator.evaluate([list.value[0]]);
  }

  second(list) {
    return this.evaluator.evaluate([list.value[1]]);
  }

  nth(list, n) {
    return this.evaluator.evaluate([list.value[n]]);
  }

  rest(list) {
    list.value.splice(0, 1);
    return list;
  }

  list(...args: any[]) {
    const quotedList = forms.list.apply(this, args);
    quotedList.quoted = true;
    return quotedList;
  }

  functions() {
    const list_fn = this.list.bind(this);
    list_fn.macro = true;

    return {
      first: this.first.bind(this),
      second: this.second.bind(this),
      nth: this.nth.bind(this),
      rest: this.rest.bind(this),
      list: list_fn,
    };
  }
}
