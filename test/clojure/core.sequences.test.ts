import { clojure } from '../../src/clojure';
import { forms } from '../../src/forms';

var list = forms.list,
  string = forms.string,
  number = forms.number,
  literal = forms.literal;

describe('Sequences', function () {
  it('mapv', function () {
    expect(clojure.run('(map odd? [1 2 3])')).toEqual([
      literal(true),
      literal(false),
      literal(true),
    ]);
  });

  it('map', function () {
    expect(clojure.run("(map odd? '(1 2 3))")).toEqual([
      literal(true),
      literal(false),
      literal(true),
    ]);
  });

  it('concat', function () {
    expect(clojure.run("(concat '(1) '(2)")).toEqual(list(number(1), number(2)));
  });

  it('concat three lists', function () {
    expect(clojure.run("(concat '(1) '(2) '(3)")).toEqual(list(number(1), number(2), number(3)));
  });

  it('cons', function () {
    var expList = list(number(1), number(2), number(3));
    expList.quoted = true;
    expect(clojure.run("(cons 1 '(2 3)")).toEqual(expList);
  });
});
