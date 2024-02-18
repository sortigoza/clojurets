import { Evaluator, SpecialForms } from './evaluator';
import { forms } from './forms';
import { NamespaceRegistry } from './namespace_registry';

const number = forms.number,
  string = forms.string,
  literal = forms.literal,
  symbol = forms.symbol,
  vector = forms.vector,
  keyword = forms.keyword,
  hash_map = forms.hash_map,
  list = forms.list,
  call = forms.call;

const namespaceRegistry = new NamespaceRegistry();
const evaluator = new Evaluator(namespaceRegistry);
namespaceRegistry.initialize(evaluator);

describe('Evaluator', function () {
  beforeEach(function () {
    namespaceRegistry.reset();
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
      namespaceRegistry.getCurrent().set('a', number(1));
      expect(namespaceRegistry.getCurrent().name).toEqual('user');
      const result = evaluator.evaluate([symbol('user', 'a')], namespaceRegistry.getCurrent());
      expect(result).toEqual(number(1));
    });

    test('should evaluate qualified symbols in other namespace', () => {
      namespaceRegistry.getCurrent().set('a', number(1));
      namespaceRegistry.set('other');
      const result = evaluator.evaluate([symbol('user', 'a')], namespaceRegistry.getCurrent());
      expect(result).toEqual(number(1));
    });

    test('should let special forms take precedence over vars', () => {
      namespaceRegistry.getCurrent().set('def', number(1));
      const result = evaluator.evaluate([symbol('def')], namespaceRegistry.getCurrent());
      expect(result).toEqual(SpecialForms.def);
    });

    test('should evaluate qualified special form-named vars', () => {
      namespaceRegistry.getCurrent().set('def', number(1));
      const result = evaluator.evaluate([symbol('user', 'def')], namespaceRegistry.getCurrent());
      expect(result).toEqual(number(1));
    });

    test('should not evaluate undefined, qualified special form-named vars', () => {
      expect(() => {
        evaluator.evaluate([symbol('user', 'def')], namespaceRegistry.getCurrent());
      }).toThrow(/No such var: user\/def/);
    });

    test('should evaluate vars in current namespace', () => {
      namespaceRegistry.getCurrent().set('a', number(1));
      const result = evaluator.evaluate([symbol('a')], namespaceRegistry.getCurrent());
      expect(result).toEqual(number(1));
    });

    test('should evaluate vars in context extending namespace', () => {
      namespaceRegistry.getCurrent().set('a', number(1));
      const extendedNamespace = namespaceRegistry.getCurrent().extend();
      const result = evaluator.evaluate([symbol('a')], extendedNamespace);
      expect(result).toEqual(number(1));
    });

    test('should throw error when symbol cannot be resolved', () => {
      expect(() => {
        evaluator.evaluate([symbol('a')], namespaceRegistry.getCurrent());
      }).toThrow(/Unable to resolve symbol: a in this context/);
    });
  });

  describe('call evaluation', () => {
    test('should evaluate calls', () => {
      namespaceRegistry.getCurrent().set('f', () => 42);
      const result = evaluator.evaluate([call(symbol('f'))], namespaceRegistry.getCurrent());
      expect(result).toEqual(42);
    });
  });

  describe('vector evaluation', () => {
    test('should evaluate vectors', () => {
      const result = evaluator.evaluate(
        [vector(number(1), number(2))],
        namespaceRegistry.getCurrent()
      );
      expect(result).toEqual(vector(number(1), number(2)));
    });
  });

  describe('hash_map evaluation', () => {
    test('should evaluate hash_maps', () => {
      const result = evaluator.evaluate(
        [hash_map(keyword('a'), number(2))],
        namespaceRegistry.getCurrent()
      );
      expect(result).toEqual(hash_map(keyword('a'), number(2)));
    });
  });

  describe('list evaluation', () => {
    test('should not eval quoted lists', () => {
      const quotedList = list(number('1'));
      quotedList.quoted = true;
      const result = evaluator.evaluate([quotedList], namespaceRegistry.getCurrent());
      expect(result).toEqual(quotedList);
    });
  });

  describe('special forms evaluation', () => {
    test('should throw error when thow call is evaluated', () => {
      expect(() => {
        evaluator.evaluate(
          [call(symbol('throw'), string('Test-error'))],
          namespaceRegistry.getCurrent()
        );
      }).toThrow(/Test-error/);
    });

    test('should return expr result if no error when using try', () => {
      const result = evaluator.evaluate(
        [call(symbol('try'), number(1), number(2))],
        namespaceRegistry.getCurrent()
      );
      expect(result).toEqual(number(1));
    });

    test('should return catchClause result if error when using try', () => {
      const result = evaluator.evaluate(
        [call(symbol('try'), call(symbol('throw'), string('Test-error')), number(2))],
        namespaceRegistry.getCurrent()
      );
      expect(result).toEqual(number(2));
    });
  });
});
