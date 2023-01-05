import { forms } from '../forms';

const number = forms.number;

function add() {
  let sum = 0;

  Array.prototype.map.call(arguments, function (n) {
    sum += n.value;
  });

  return number(sum);
}

function substract() {
  let sum = arguments[0];

  Array.prototype.map.call(Array.prototype.slice.call(arguments, 1), function (n) {
    sum -= n.value;
  });

  return number(sum);
}

function multiply() {
  let product = 1;

  Array.prototype.map.call(arguments, function (n) {
    product *= n.value;
  });

  return number(product);
}

function divide() {
  let product = arguments[0];

  Array.prototype.map.call(Array.prototype.slice.call(arguments, 1), function (n) {
    product /= n.value;
  });

  return number(product);
}

function mod(dividend, divisor) {
  return number(dividend.value % divisor.value);
}

const arithmetic = {
  '+': add,
  '-': substract,
  '*': multiply,
  '/': divide,
  mod,
};
export { arithmetic };
