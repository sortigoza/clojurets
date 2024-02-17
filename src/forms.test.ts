import { Form } from './form';
import { forms } from './forms';

describe('Form', function () {
  it('new form initialization', function () {
    const form = new Form(
      'symbol', // kind
      'user', // namespace
      3, // value
      '[', // openChr
      ']', // closeChr
      false // terminal
    );
    expect(form.kind).toEqual('symbol');
    expect(form.namespace).toEqual('user');
    expect(form.value).toEqual(3);
    expect(form.openChr).toEqual('[');
    expect(form.closeChr).toEqual(']');
    expect(form.terminal).toEqual(false);
    expect(form.quoted).toEqual(false);
  });

  it('converts to str a terminal form', function () {
    const form = new Form(
      'string', // kind
      'user', // namespace
      'str-val', // value
      '"', // openChr
      '"', // closeChr
      undefined // terminal
    );

    expect(form.toString()).toEqual('"str-val"');
  });

  it('converts to str a non-terminal form', function () {
    const inner_form1 = new Form(
      'number', // kind
      'user', // namespace
      3, // value
      undefined, // openChr
      undefined, // closeChr
      undefined // terminal
    );
    const inner_form2 = new Form(
      'number', // kind
      'user', // namespace
      4, // value
      undefined, // openChr
      undefined, // closeChr
      undefined // terminal
    );
    const form = new Form(
      'vector', // kind
      'user', // namespace
      [inner_form1, inner_form2], // value
      '[', // openChr
      ']', // closeChr
      false // terminal
    );
    expect(form.toString()).toEqual('[3 4]');
  });
});

describe('forms', function () {
  it('has `number` form', function () {
    // can be called
    forms.number(3);

    // has a pattern defined
    expect(forms.number.pattern).toBeDefined();

    // validate the pattern
    let ok_samples = ['1', "'2"];
    for (const sample of ok_samples) {
      expect(forms.number.pattern.exec(sample)[0]).toEqual(sample);
    }
  });
  it('has `string` form', function () {
    // can be called
    forms.string('hello world');

    // has a pattern defined
    expect(forms.string.pattern).toBeDefined();

    // validate the pattern
    let ok_samples = ['"1', '"a string'];
    for (const sample of ok_samples) {
      expect(forms.string.pattern.exec(sample)[0]).toEqual(sample);
    }
  });
  it('has `literal` form', function () {
    // can be called
    forms.literal('true');

    // has a pattern defined
    expect(forms.literal.pattern).toBeDefined();

    // validate the pattern
    let ok_samples = ['true', 'false', 'nil'];
    for (const sample of ok_samples) {
      expect(forms.literal.pattern.exec(sample)[0]).toEqual(sample);
    }
  });
  it('has `symbol` form', function () {
    // can be called
    forms.symbol('a');

    // has a pattern defined
    expect(forms.symbol.pattern).toBeDefined();

    // validate the pattern
    let ok_samples = ['a', 'my_var', '+', '_x'];
    for (const sample of ok_samples) {
      expect(forms.symbol.pattern.exec(sample)[0]).toEqual(sample);
    }
  });
  it('has `keyword` form', function () {
    // can be called
    forms.keyword(':name');

    // has a pattern defined
    expect(forms.keyword.pattern).toBeDefined();

    // validate the pattern
    let ok_samples = [':a', ':name', '::date'];
    for (const sample of ok_samples) {
      expect(forms.keyword.pattern.exec(sample)[0]).toEqual(sample);
    }
  });
  it('has `vector` form', function () {
    // can be called
    forms.vector('[1, 2]');

    // has a pattern defined
    expect(forms.vector.pattern).toBeDefined();

    // validate the pattern
    let ok_samples = ['[]', '[1 2]'];
    for (const sample of ok_samples) {
      expect(forms.vector.pattern.exec(sample)[0]).toEqual('[');
    }
  });
  it('has `call` form', function () {
    // can be called
    forms.call('(+ 1 2)');

    // has a pattern defined
    expect(forms.call.pattern).toBeDefined();

    // validate the pattern
    let ok_samples = ['(+ 1 2)'];
    for (const sample of ok_samples) {
      expect(forms.call.pattern.exec(sample)[0]).toEqual('(');
    }
  });
  it('has `list` form', function () {
    // can be called
    forms.list('(1 2)');

    // has a pattern defined
    expect(forms.list.pattern).toBeDefined();

    // validate the pattern
    let ok_samples = ['(1 2)'];
    for (const sample of ok_samples) {
      expect(forms.list.pattern.exec(sample)[0]).toEqual('(');
    }
  });
  it('has `comment` form', function () {
    // can be called
    forms.comment('; comment');

    // has a pattern defined
    expect(forms.comment.pattern).toBeDefined();

    // validate the pattern
    let ok_samples = ['; my-comment'];
    for (const sample of ok_samples) {
      expect(forms.comment.pattern.exec(sample)[0]).toEqual(sample);
    }
  });
  it('has `hash_map` form', function () {
    // can be called
    forms.hash_map('{:a 1 :b 2}');

    // has a pattern defined
    expect(forms.hash_map.pattern).toBeDefined();

    // validate the pattern
    let ok_samples = ['{}', '{:a 1 :b 2}'];
    for (const sample of ok_samples) {
      expect(forms.hash_map.pattern.exec(sample)[0]).toEqual('{');
    }
  });
});
