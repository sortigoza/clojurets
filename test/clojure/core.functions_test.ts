import { clojure } from '../../src/clojure';
import { forms } from '../../src/forms';
import { Namespace } from '../../src/namespace';

const literal = forms.literal,
  number = forms.number;

describe('Functions', function () {
  beforeEach(function () {
    Namespace.reset();
  });

  it('partial', function () {
    clojure.run('((partial + 2) 3)').should.eql(number(5));
  });

  describe('defn', function () {
    it('should define function', function () {
      clojure.run('(defn testfun [a b] (+ a b))');
      clojure.run('(testfun 1 2)').should.eql(number(3));
    });

    it('should define function without body', function () {
      clojure.run('(defn testfun [])');
      clojure.run('(testfun)').should.eql(literal(null));
    });
  });
});
