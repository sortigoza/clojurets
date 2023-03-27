import { clojure } from '../../src/clojure';
import { forms } from '../../src/forms';

var literal = forms.literal;

describe('Primitives', function () {
  describe('Numbers', function () {
    describe('Test', function () {
      it('odd?', function () {
        expect(clojure.run('(odd? 1)')).toEqual(literal(true));
        expect(clojure.run('(odd? 2)')).toEqual(literal(false));
      });

      it('even?', function () {
        expect(clojure.run('(even? 1)')).toEqual(literal(false));
        expect(clojure.run('(even? 2)')).toEqual(literal(true));
      });
    });
  });
});
