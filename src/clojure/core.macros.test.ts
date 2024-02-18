import { clojure } from '../clojure';
import { forms } from '../forms';

const number = forms.number;

describe('Macros', function () {
  it('defmacro', function () {
    clojure.run('(defmacro unless [expr body] `(if expr nil body))');
    expect(clojure.run('(unless (= 1 2) (+ 1 2))')).toEqual(number(3));
  });

  describe('assert', () => {
    it('should throw exception when condition is false', () => {
      expect(() => {
        clojure.run('(assert (= 1 2))');
      }).toThrow(/Assert failed: \(= 1 2\)/);
    });

    it('should handle asserts failing due to invalid symbol', () => {
      expect(() => {
        clojure.run('(assert (= __ 2))');
      }).toThrow(/Assert failed: \(= __ 2\)/);
    });

    it('should not throw exception when condition is true', () => {
      expect(() => {
        clojure.run('(assert (= 1 1))');
      }).not.toThrow();
    });
  });
});
