import { forms } from '../../src/forms';
import { clojure } from '../../src/clojure';

var sinon = require('sinon'),
  number = forms.number,
  string = forms.string;

describe('IO', function () {
  describe('println', function () {
    before(function () {
      sinon.spy(console, 'log');
    });

    it('', function () {
      clojure.run('(println 1 2 3 "clojure")');
      console.log
        .alwaysCalledWithExactly(number(1), number(2), number(3), string('clojure'))
        .should.equal(true);
    });

    after(function () {
      console.log.restore();
    });
  });
});
