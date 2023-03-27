import { clojure } from '../../src/clojure';
import { forms } from '../../src/forms';

var list = forms.list,
  number = forms.number,
  keyword = forms.keyword,
  hash_map = forms.hash_map;

describe('Collections', function () {
  describe('Maps', function () {
    it('get', function () {
      expect(clojure.run('(get {:a 1} :a)')).toEqual(number(1));
    });
    it('keys', function () {
      expect(clojure.run('(keys {:a 1 :b 2})')).toEqual(list(keyword('a'), keyword('b')));
    });
    it('vals', function () {
      expect(clojure.run('(vals {:a 1 :b 2})')).toEqual(list(number(1), number(2)));
    });
    it('hash-map', function () {
      var expList = hash_map(keyword('a'), number(1), keyword('b'), number(2));
      expList.quoted = true;
      expect(clojure.run('(hash-map :a 1 :b 2)')).toEqual(expList);
    });
  });
});
