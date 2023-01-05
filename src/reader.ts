import { forms } from './forms';

const formParsers = {
  number: parseNumber,
  string: parseString,
  symbol: parseSymbol,
  keyword: parseKeyword,
  vector: parseVector,
  hash_map: parseHashMap,
  list: parseList,
  comment: parseComment,
};

export class Reader {
  read(str) {
    return parseExpressions(str);
  }
}

function parseExpressions(str, cursor?, closeChr?) {
  let expressions = [],
    formKind,
    form,
    match,
    currentChar;

  cursor = cursor || { pos: 0 };

  for (; cursor.pos < str.length; cursor.pos++) {
    currentChar = str[cursor.pos];
    for (formKind in formParsers) {
      if (forms.hasOwnProperty(formKind)) {
        if ((match = forms[formKind].pattern.exec(str.substr(cursor.pos)))) {
          form = formParsers[formKind](match, cursor, str);
          if (form) {
            expressions.push(form);
          }
          break;
        }
      }
    }

    if (currentChar === closeChr) {
      break;
    }
  }

  return expressions;
}

function parseNumber(match, cursor) {
  cursor.pos += match[0].length - 1;

  const quoted = match[1] === "'" || match[1] === '`';
  const numVal = quoted ? +match[0].substr(1) : +match[0];
  return forms.number(numVal);
}

function parseString(match, cursor) {
  cursor.pos += match[0].length;

  return forms.string(match[1]);
}

function parseSymbol(match, cursor) {
  cursor.pos += match[0].length - 1;

  if (isLiteral(match)) {
    return forms.literal(match[2]);
  }

  return forms.symbol(match[1], match[2]);
}

function isLiteral(match) {
  const isQualified = match[1] !== undefined;

  return !isQualified && forms.literal.pattern.exec(match[0]);
}

function parseKeyword(match, cursor) {
  cursor.pos += match[0].length - 1;

  return forms.keyword(match[1], match[2]);
}

function parseVector(match, cursor, str) {
  cursor.pos += match[0].length;

  return forms.vector.apply(forms, parseExpressions(str, cursor, forms.vector.closeChr));
}

function parseHashMap(match, cursor, str) {
  cursor.pos += match[0].length;

  return forms.hash_map.apply(forms, parseExpressions(str, cursor, forms.hash_map.closeChr));
}

function parseList(match, cursor, str) {
  cursor.pos += match[0].length;

  // No need to distinguish between standard and syntax-
  // quoted lists until we decide to support namespaces
  const quoted = match[1] === "'" || match[1] === '`';

  const subExpressions = parseExpressions(str, cursor, forms.list.closeChr),
    isCall = !quoted && subExpressions.length > 0,
    form = isCall ? forms.call : forms.list;
  const applied_form = form.apply(forms, subExpressions);
  applied_form.quoted = quoted;
  return applied_form;
}

function parseComment(match, cursor) {
  cursor.pos += match[0].length;

  return null;
}
