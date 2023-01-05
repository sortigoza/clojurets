import { Form } from './form';

const SYM_HEAD = 'a-z\\*\\+\\!\\-\\_\\?\\.\\~\\@',
  SYM_TAIL = SYM_HEAD + '0-9',
  forms = {
    number: createFormGenerator('number', /^(')?\d+/),
    string: createFormGenerator('string', /^'?"(([^\\"]|\\\\|\\")*)/, '"', '"'),
    literal: createFormGenerator('literal', /^'?(true|false|nil)$/),
    symbol: createFormGenerator(
      'symbol',
      new RegExp(
        '^' +
          "'?" + // Optional single-quote
          '(?:([' +
          SYM_HEAD +
          '][' +
          SYM_TAIL +
          ']*)\\/)?' + // Optional namespace
          '([' +
          SYM_HEAD +
          '\\/|=' +
          '][' +
          SYM_TAIL +
          ']*)',
        'i' // Symbol
      )
    ),
    keyword: createFormGenerator(
      'keyword',
      new RegExp(
        '^' +
          "'?" + // Optional single-quote
          '::?' + // 1 or 2 colons
          '(?:([' +
          SYM_HEAD +
          '][' +
          SYM_TAIL +
          ']*)\\/)?' + // Optional namespace
          '([' +
          SYM_HEAD +
          '=' +
          '][' +
          SYM_TAIL +
          ']*)',
        'i' // Keyword
      ),
      ':'
    ),
    vector: createFormGenerator('vector', /^('?)\[/, '[', ']', false),
    hash_map: createFormGenerator('hash_map', /^('?)\{/, '{', '}', false),
    call: createFormGenerator('call', /^('?)\(/, '(', ')', false),
    list: createFormGenerator('list', /^(['`])?\(/, '(', ')', false),
    comment: createFormGenerator('comment', /^;.*?(\n|$)/),
  };

function createFormGenerator(kind, pattern, openChr?, closeChr?, terminal?) {
  function generator(...args: any[]) {
    const namespace = terminal !== false && args.length === 2 ? args.shift() : undefined,
      value = terminal === false ? args : args.shift();
    return new Form(kind, namespace, value, openChr, closeChr, terminal);
  }

  generator.kind = kind;
  generator.pattern = pattern;
  generator.closeChr = closeChr;

  return generator;
}

export { forms };
