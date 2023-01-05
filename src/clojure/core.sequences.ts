import { forms } from '../forms';

const list = forms.list;

export function map(f, coll) {
  if (coll.kind === 'list') {
    return Array.prototype.map.call(coll.value, function (elem) {
      return f(elem.value);
    });
  }

  const result = coll.value.map(f);

  return result;
}

export function concat() {
  let concatList = [];

  Array.prototype.map.call(arguments, function (coll) {
    concatList = concatList.concat(coll.value);
  });

  return list.apply(this, concatList);
}

export function cons(element, list) {
  list.value.splice(0, 0, element);
  return list;
}

// todo: Remove this, figure out how to handle
// the arguments properly
cons.macro = true;
