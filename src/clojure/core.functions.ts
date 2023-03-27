import { SpecialForms } from '../evaluator';
import { forms } from '../forms';
import { Namespace } from '../namespace';

const literal = forms.literal;

export function partial() {
  const func = arguments[0],
    args = Array.prototype.slice.call(arguments, 1);
  return function () {
    const context = this;

    return function () {
      let result;
      Array.prototype.map.call(arguments, function (a) {
        args.push(a);
      });
      result = func.apply(context, args);
      if (result === undefined || result === null) {
        return literal(null);
      }
      return result;
    }.apply(context, arguments);
  };
}

export function defn(name, args, exprs) {
  Namespace.current.set(name.value, SpecialForms.fn({ value: ['', args, exprs] }, this));
}

defn.macro = true;
