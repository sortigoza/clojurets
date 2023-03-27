import { Reader } from '../src/reader';
import { forms } from '../src/forms';

const reader = new Reader(),
  number = forms.number,
  string = forms.string,
  literal = forms.literal,
  symbol = forms.symbol,
  keyword = forms.keyword,
  vector = forms.vector,
  hash_map = forms.hash_map,
  list = forms.list,
  call = forms.call;

describe('Reader', function () {
  describe('number parsing', function () {
    it('should read integers', function () {
      expect(reader.read('42')).toEqual([number(42)]);
    });
  });

  describe('string parsing', function () {
    it('should read strings', function () {
      expect(reader.read('"clojure"')).toEqual([string('clojure')]);
    });

    it('should read strings with escapes', function () {
      expect(reader.read('"clo\\"jure"')).toEqual([string('clo\\"jure')]);
    });
  });

  describe('literal parsing', function () {
    it('should read true', function () {
      expect(reader.read('true')).toEqual([literal('true')]);
    });

    it('should read false', function () {
      expect(reader.read('false')).toEqual([literal('false')]);
    });

    it('should read nil', function () {
      expect(reader.read('nil')).toEqual([literal('nil')]);
    });

    it('should ignore symbols with leading literal names', function () {
      expect(reader.read('nil?')).toEqual([symbol('nil?')]);
    });
  });

  describe('symbol parsing', function () {
    it('should read alphanumeric symbols', function () {
      expect(reader.read('a1')).toEqual([symbol('a1')]);
    });

    it('should read symbols with special characters', function () {
      expect(reader.read('*+!-_?')).toEqual([symbol('*+!-_?')]);
      expect(reader.read('/')).toEqual([symbol('/')]);
      expect(reader.read('=')).toEqual([symbol('=')]);
      expect(reader.read('.')).toEqual([symbol('.')]);
    });

    it('should read namespaced symbols', function () {
      expect(reader.read('a.b.c/d')).toEqual([symbol('a.b.c', 'd')]);
    });
  });

  describe('keyword parsing', function () {
    it('should read keywords', function () {
      expect(reader.read(':clojure')).toEqual([keyword('clojure')]);
    });

    it('should read namespaced keywords', function () {
      expect(reader.read(':a.b.c/d')).toEqual([keyword('a.b.c', 'd')]);
    });
  });

  describe('vector parsing', function () {
    it('should read vectors', function () {
      expect(reader.read('[42 "clojure"]')).toEqual([vector(number(42), string('clojure'))]);
    });
    it('should read nested vectors', function () {
      expect(reader.read('[1 2 [3]]')).toEqual([vector(number(1), number(2), vector(number(3)))]);
    });
  });
  describe('hash_map parsing', function () {
    it('should read hash_maps', function () {
      expect(reader.read('{:a "clojure"}')).toEqual([hash_map(keyword('a'), string('clojure'))]);
    });

    it('should read nested hash_maps', function () {
      expect(reader.read('{:a 1 :b {:c 3}}')).toEqual([
        hash_map(keyword('a'), number(1), keyword('b'), hash_map(keyword('c'), number(3))),
      ]);
    });
  });

  describe('list parsing', function () {
    it('should read empty lists', function () {
      expect(reader.read('()')).toEqual([list()]);
    });

    it('should read quoted lists', function () {
      const expList = list(number(42), string('clojure'));
      expList.quoted = true;
      expect(reader.read('\'(42 "clojure")')).toEqual([expList]);
    });

    it('should read syntax-quoted lists', function () {
      const expList = list(number(42), string('clojure'));
      expList.quoted = true;
      expect(reader.read('`(42 "clojure")')).toEqual([expList]);
    });

    it('should parse numbers in quoted lists', function () {
      expect(reader.read("'(1 2 3)")[0].value[0].value).toEqual(1);
    });
  });

  describe('call parsing', function () {
    it('should read no-argument calls', function () {
      expect(reader.read('(func)')).toEqual([call(symbol('func'))]);
    });

    it('should read calls with arguments', function () {
      expect(reader.read('(+ 1 1)')).toEqual([call(symbol('+'), number(1), number(1))]);
    });

    it('should read nested calls', function () {
      const expCall = call(
        symbol('+'),
        number(1),
        call(symbol('*'), number(2), number(3)),
        number(4)
      );
      expCall.quoted = false;
      expect(reader.read('(+ 1 (* 2 3) 4)')).toEqual([expCall]);
    });
  });

  describe('general quote parsing', function () {
    it('should handle quoted numbers', function () {
      expect(reader.read("'1")[0].value).toEqual(1);
    });

    it('should handle quoted keywords', function () {
      expect(reader.read("':a")[0].value).toEqual('a');
    });

    it('should handle quoted strings', function () {
      expect(reader.read('\'"a"')[0].value).toEqual('a');
    });
  });

  describe('comment parsing', function () {
    it('should ignore comments', function () {
      expect(reader.read(';ignore this line')).toEqual([]);
    });
  });

  describe('map parsing', function () {
    it('should read maps', function () {
      // TODO: Write the test case for map parsing
    });
  });
});
