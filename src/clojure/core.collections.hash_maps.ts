import { evaluator } from '../evaluator';
import { forms } from '../forms';

function get(map, k) {
  for (let index = 0; index < map.value.length; index = index + 2) {
    if (k.kind === map.value[index].kind && k.value === map.value[index].value) {
      return map.value[index + 1];
    }
  }

  return;
}

function keys(map) {
  const values = [];
  for (let index = 0; index < map.value.length; index = index + 2) {
    values.push(map.value[index]);
  }
  return forms.list.apply(this, values);
}

function vals(map) {
  const values = [];
  for (let index = 1; index < map.value.length; index = index + 2) {
    values.push(map.value[index]);
  }
  return forms.list.apply(this, values);
}

function hash_map_fn(...args: any[]) {
  const quotedList = forms.hash_map.apply(this, args);
  quotedList.quoted = true;
  return quotedList;
}

hash_map_fn.macro = true;

const maps = {
  get,
  keys,
  vals,
  'hash-map': hash_map_fn,
};
export { maps };
