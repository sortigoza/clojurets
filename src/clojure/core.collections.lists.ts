import { evaluator } from '../evaluator';
import { forms } from '../forms';

function first(list) {
  return evaluator.evaluate([list.value[0]]);
}

function second(list) {
  return evaluator.evaluate([list.value[1]]);
}

function nth(list, n) {
  return evaluator.evaluate([list.value[n]]);
}

function rest(list) {
  list.value.splice(0, 1);
  return list;
}

function list_fn(...args: any[]) {
  const quotedList = forms.list.apply(this, args);
  quotedList.quoted = true;
  return quotedList;
}

list_fn.macro = true;

const collections = {
  first,
  second,
  nth,
  rest,
  list: list_fn,
};
export { collections };
