import { clojure } from '../../src/clojure';
import { forms } from '../../src/forms';

var list = forms.list,
  number = forms.number;

describe('Collections', function () {
  describe('Lists', function () {
    it('first', function () {
      expect(clojure.run("(first '(1 2 3)")).toEqual(number(1));
    });
    it('second', function () {
      expect(clojure.run("(second '(1 2 3)")).toEqual(number(2));
    });
    it('nth', function () {
      expect(clojure.run("(nth '(0 1 2) 1")).toEqual(number(1));
    });
    it('rest', function () {
      var expList = list(number(2), number(3));
      expList.quoted = true;
      expect(clojure.run("(rest '(1 2 3)")).toEqual(expList);
    });
    it('list', function () {
      var expList = list(number(1), number(2));
      expList.quoted = true;
      expect(clojure.run('(list 1 2)')).toEqual(expList);
    });
  });
});
