import { evaluator, SpecialForms } from './evaluator';
import { forms } from './forms';
import { Namespace } from './namespace';

const number = forms.number,
  string = forms.string,
  literal = forms.literal,
  symbol = forms.symbol,
  vector = forms.vector,
  keyword = forms.keyword,
  hash_map = forms.hash_map,
  list = forms.list,
  call = forms.call;

describe('Evaluator', function () {
  beforeEach(function () {
    Namespace.reset();
  });

  it('should evaluate numbers', function () {
    const result = evaluator.evaluate([number(42)]);
    expect(result).toEqual(number(42));
  });

  it('should evaluate strings', function () {
    const result = evaluator.evaluate([string('clojure')]);
    expect(result).toEqual(string('clojure'));
  });

  describe('literal evaluation', function () {
    test('should evaluate true', () => {
      const result = evaluator.evaluate([literal('true')]);
      expect(result).toEqual(literal(true));
    });

    test('should evaluate false', () => {
      const result = evaluator.evaluate([literal('false')]);
      expect(result).toEqual(literal(false));
    });

    test('should evaluate nil', () => {
      const result = evaluator.evaluate([literal('nil')]);
      expect(result).toEqual(literal(null));
    });
  });

  describe('symbol evaluation', function () {
    test('should evaluate qualified symbols in current namespace', () => {
      Namespace.current.set('a', number(1));
      const result = evaluator.evaluate([symbol('user', 'a')], Namespace.current);
      expect(result).toEqual(number(1));
    });

    test('should evaluate qualified symbols in other namespace', () => {
      Namespace.current.set('a', number(1));
      Namespace.set('other');
      const result = evaluator.evaluate([symbol('user', 'a')], Namespace.current);
      expect(result).toEqual(number(1));
    });

    test('should let special forms take precedence over vars', () => {
      Namespace.current.set('def', number(1));
      const result = evaluator.evaluate([symbol('def')], Namespace.current);
      expect(result).toEqual(SpecialForms.def);
    });

    test('should evaluate qualified special form-named vars', () => {
      Namespace.current.set('def', number(1));
      const result = evaluator.evaluate([symbol('user', 'def')], Namespace.current);
      expect(result).toEqual(number(1));
    });

    test('should not evaluate undefined, qualified special form-named vars', () => {
      expect(() => {
        evaluator.evaluate([symbol('user', 'def')], Namespace.current);
      }).toThrow(/No such var: user\/def/);
    });

    test('should evaluate vars in current namespace', () => {
      Namespace.current.set('a', number(1));
      const result = evaluator.evaluate([symbol('a')], Namespace.current);
      expect(result).toEqual(number(1));
    });

    test('should evaluate vars in context extending namespace', () => {
      Namespace.current.set('a', number(1));
      const extendedNamespace = Namespace.current.extend();
      const result = evaluator.evaluate([symbol('a')], extendedNamespace);
      expect(result).toEqual(number(1));
    });

    test('should throw error when symbol cannot be resolved', () => {
      expect(() => {
        evaluator.evaluate([symbol('a')], Namespace.current);
      }).toThrow(/Unable to resolve symbol: a in this context/);
    });
  });

  describe('call evaluation', () => {
    test('should evaluate calls', () => {
      Namespace.current.set('f', () => 42);
      const result = evaluator.evaluate([call(symbol('f'))], Namespace.current);
      expect(result).toEqual(42);
    });
  });

  describe('vector evaluation', () => {
    test('should evaluate vectors', () => {
      const result = evaluator.evaluate([vector(number(1), number(2))], Namespace.current);
      expect(result).toEqual(vector(number(1), number(2)));
    });
  });

  describe('hash_map evaluation', () => {
    test('should evaluate hash_maps', () => {
      const result = evaluator.evaluate([hash_map(keyword('a'), number(2))], Namespace.current);
      expect(result).toEqual(hash_map(keyword('a'), number(2)));
    });
  });

  describe('list evaluation', () => {
    test('should not eval quoted lists', () => {
      const quotedList = list(number('1'));
      quotedList.quoted = true;
      const result = evaluator.evaluate([quotedList], Namespace.current);
      expect(result).toEqual(quotedList);
    });
  });

  describe('special forms evaluation', () => {
    test('should throw error when thow call is evaluated', () => {
      expect(() => {
        evaluator.evaluate([call(symbol('throw'), string('Test-error'))], Namespace.current);
      }).toThrow(/Test-error/);
    });

    test('should return expr result if no error when using try', () => {
      const result = evaluator.evaluate(
        [call(symbol('try'), number(1), number(2))],
        Namespace.current
      );
      expect(result).toEqual(number(1));
    });

    test('should return catchClause result if error when using try', () => {
      const result = evaluator.evaluate(
        [call(symbol('try'), call(symbol('throw'), string('Test-error')), number(2))],
        Namespace.current
      );
      expect(result).toEqual(number(2));
    });
  });
});
