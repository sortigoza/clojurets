import { clojure } from '../../src/clojure';
import { forms } from '../../src/forms';
import { Namespace } from '../../src/namespace';

var number = forms.number,
  literal = forms.literal;

describe('Special Forms', function () {
  beforeEach(function () {
    Namespace.reset();
  });

  describe('def', function () {
    it('should define var with null value by default', function () {
      clojure.run('(def a)');

      expect(Namespace.current.get('a')).toEqual(literal(null));
    });
    it('should define var with given value', function () {
      clojure.run('(def a 5)');

      expect(Namespace.current.get('a')).toEqual(number(5));
    });
  });

  it('if', function () {
    expect(clojure.run('(if true 42 (this-is-not-evaluated)')).toEqual(number(42));
    expect(clojure.run('(if false (this-is-not-evaluated) 43)')).toEqual(number(43));
  });

  describe('fn', function () {
    it('should define anonymous function', function () {
      expect(clojure.run('((fn [a b] (+ a b)) 1 2)')).toEqual(number(3));
    });

    it('should define anonymous function without body', function () {
      expect(clojure.run('((fn [a b]))')).toEqual(literal(null));
    });
  });

  describe('let', function () {
    it('should apply bindings to inner context', function () {
      Namespace.current.set('x', number(1));
      expect(clojure.run('(let [x 2] x)')).toEqual(number(2));
      expect(clojure.run('x')).toEqual(number(1));
    });

    it('should throw exception when uneven number of bindings', function () {
      expect(() => clojure.run('(let [x 1 y])')).toThrow(
        /let requires an even number of forms in binding vector/
      );
    });
  });
});
