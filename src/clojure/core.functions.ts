import { SpecialForms } from '../evaluator';
import { forms } from '../forms';
import { Namespace } from '../namespace';

const { literal } = forms;

export function partial(func: Function, ...args: any[]) {
  return function (this: any, ...rest: any[]) {
    const context = this;
    const allArgs = [...args, ...rest];

    const result = func.apply(context, allArgs);
    if (result == null) {
      return literal(null);
    }
    return result;
  };
}

export function defn(name: any, args: any, exprs: any) {
  Namespace.current.set(name.value, SpecialForms.fn({ value: ['', args, exprs] }, this));
}

defn.macro = true;
