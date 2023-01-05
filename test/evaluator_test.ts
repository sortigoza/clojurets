import { forms } from '../src/forms';
import { evaluator } from '../src/evaluator';
import { SpecialForms } from '../src/evaluator';
import { Namespace } from '../src/namespace';

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
    evaluator.evaluate([number(42)]).should.eql(number(42));
  });

  it('should evaluate strings', function () {
    evaluator.evaluate([string('clojure')]).should.eql(string('clojure'));
  });

  describe('literal evaluation', function () {
    it('should evaluate true', function () {
      evaluator.evaluate([literal('true')]).should.eql(literal(true));
    });

    it('should evaluate false', function () {
      evaluator.evaluate([literal('false')]).should.eql(literal(false));
    });

    it('should evaluate nil', function () {
      evaluator.evaluate([literal('nil')]).should.eql(literal(null));
    });
  });

  describe('symbol evaluation', function () {
    it('should evaluate qualified symbols in current namespace', function () {
      Namespace.current.set('a', number(1));
      evaluator.evaluate([symbol('user', 'a')], Namespace.current).should.eql(number(1));
    });

    it('should evaluate qualified symbols in other namespace', function () {
      Namespace.current.set('a', number(1));
      Namespace.set('other');
      evaluator.evaluate([symbol('user', 'a')], Namespace.current).should.eql(number(1));
    });

    it('should let special forms take precedence over vars', function () {
      Namespace.current.set('def', number(1));
      evaluator.evaluate([symbol('def')], Namespace.current).should.equal(SpecialForms.def);
    });

    it('should evaluate qualified special form-named vars', function () {
      Namespace.current.set('def', number(1));
      evaluator.evaluate([symbol('user', 'def')], Namespace.current).should.eql(number(1));
    });

    it('should not evaluate undefined, qualified special form-named vars', function () {
      (function () {
        evaluator.evaluate([symbol('user', 'def')], Namespace.current);
      }.should.throw(/No such var: user\/def/));
    });

    it('should evaluate vars in current namespace', function () {
      Namespace.current.set('a', number(1));
      evaluator.evaluate([symbol('a')], Namespace.current).should.eql(number(1));
    });

    it('should evaluate vars in context extending namespace', function () {
      Namespace.current.set('a', number(1));
      evaluator.evaluate([symbol('a')], Namespace.current.extend()).should.eql(number(1));
    });

    it('should throw error when symbol cannot be resolved', function () {
      (function () {
        evaluator.evaluate([symbol('a')], Namespace.current);
      }.should.throw(/Unable to resolve symbol: a in this context/));
    });
  });

  describe('call evaluation', function () {
    it('should evaluate calls', function () {
      Namespace.current.set('f', function () {
        return 42;
      });
      evaluator.evaluate([call(symbol('f'))], Namespace.current).should.equal(42);
    });
  });

  describe('vector evaluation', function () {
    it('should evaluate vectors', function () {
      evaluator
        .evaluate([vector(number(1), number(2))], Namespace.current)
        .should.eql(vector(number(1), number(2)));
    });
  });

  describe('hash_map evaluation', function () {
    it('should evaluate hash_maps', function () {
      evaluator
        .evaluate([hash_map(keyword('a'), number(2))], Namespace.current)
        .should.eql(hash_map(keyword('a'), number(2)));
    });
  });

  describe('list evaluation', function () {
    it('should not eval quoted lists', function () {
      var quotedList = list(number('1'));
      quotedList.quoted = true;
      evaluator.evaluate([quotedList], Namespace.current).should.equal(quotedList);
    });
  });

  describe('special forms evaluation', function () {
    it('should throw error when thow call is evaluated', function () {
      (function () {
        evaluator.evaluate([call(symbol('throw'), string('Test-error'))], Namespace.current);
      }.should.throw(/Test-error/));
    });

    it('should return expr result if no error when using try', function () {
      evaluator
        .evaluate([call(symbol('try'), number(1), number(2))], Namespace.current)
        .should.eql(number(1));
    });

    it('should return catchClause result if error when using try', function () {
      evaluator
        .evaluate(
          [call(symbol('try'), call(symbol('throw'), string('Test-error')), number(2))],
          Namespace.current
        )
        .should.eql(number(2));
    });
  });
});
