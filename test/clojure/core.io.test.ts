import { forms } from '../../src/forms';
import { clojure } from '../../src/clojure';
import { describe, expect, test } from '@jest/globals';

var number = forms.number,
  string = forms.string;

const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

describe('IO', function () {
  describe('println', function () {
    beforeEach(function () {
      consoleSpy.mockClear();
    });

    it('', function () {
      clojure.run('(println 1 2 3 "clojure")');
      expect(console.log).toBeCalledTimes(1);
      expect(console.log).toHaveBeenLastCalledWith(
        number(1),
        number(2),
        number(3),
        string('clojure')
      );
    });
  });
});
