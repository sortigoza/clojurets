import { clojure } from '../../src/clojure';
import { forms } from '../../src/forms';

var number = forms.number;

describe('Primitives', function () {
  describe('Numbers', function () {
    describe('Arithmetic', function () {
      it('+', function () {
        expect(clojure.run('(+ 1 2 3)')).toEqual(number(6));
      });
      it('-', function () {
        expect(clojure.run('(- 1 2)')).toEqual(number(-1));
      });
      it('*', function () {
        expect(clojure.run('(* 2 3)')).toEqual(number(6));
      });
      it('/', function () {
        expect(clojure.run('(/ 6 2)')).toEqual(number(3));
      });
      it('mod', function () {
        expect(clojure.run('(mod 17 13')).toEqual(number(4));
      });
    });
  });
});
