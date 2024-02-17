import { clojure } from '../clojure';
import { forms } from '../forms';
import { Namespace } from '../namespace';

const literal = forms.literal,
  number = forms.number;

describe('Functions', function () {
  beforeEach(function () {
    Namespace.reset();
  });

  it('partial', function () {
    expect(clojure.run('((partial + 2) 3)')).toEqual(number(5));
  });

  describe('defn', function () {
    it('should define function', function () {
      clojure.run('(defn testfun [a b] (+ a b))');
      expect(clojure.run('(testfun 1 2)')).toEqual(number(3));
    });

    it('should define function without body', function () {
      clojure.run('(defn testfun [])');
      expect(clojure.run('(testfun)')).toEqual(literal(null));
    });
  });
});
