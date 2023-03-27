import { forms } from '../forms';

const literal = forms.literal;

function is_odd(n) {
  return literal(n % 2 === 1);
}

function is_even(n) {
  return literal(n % 2 === 0);
}

const numbers_test = {
  'odd?': is_odd,
  'even?': is_even,
};
export { numbers_test };
