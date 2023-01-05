import { clojure } from '../../src/clojure';
import { forms } from '../../src/forms';

var list = forms.list,
  number = forms.number,
  keyword = forms.keyword,
  hash_map = forms.hash_map;

describe('Collections', function () {
  describe('Maps', function () {
    it('get', function () {
      clojure.run('(get {:a 1} :a)').should.eql(number(1));
    });
    it('keys', function () {
      clojure.run('(keys {:a 1 :b 2})').should.eql(list(keyword('a'), keyword('b')));
    });
    it('vals', function () {
      clojure.run('(vals {:a 1 :b 2})').should.eql(list(number(1), number(2)));
    });
    it('hash-map', function () {
      var expList = hash_map(keyword('a'), number(1), keyword('b'), number(2));
      expList.quoted = true;
      clojure.run('(hash-map :a 1 :b 2)').should.eql(expList);
    });
  });
});
