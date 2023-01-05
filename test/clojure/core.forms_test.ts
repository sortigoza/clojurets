import { Form } from '../../src/form';
import { forms } from '../../src/forms';

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
    form.kind.should.equal('symbol');
    form.namespace.should.equal('user');
    form.value.should.equal(3);
    form.openChr.should.equal('[');
    form.closeChr.should.equal(']');
    form.terminal.should.equal(false);
    form.quoted.should.equal(false);
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

    form.toString().should.equal('"str-val"');
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
    form.toString().should.equal('[3 4]');
  });
});

describe('forms', function () {
  it('has `number` form', function () {
    // can be called
    forms.number(3);

    // has a pattern defined
    forms.number.pattern.should.not.be.undefined();

    // validate the pattern
    let ok_samples = ['1', "'2"];
    for (const sample of ok_samples) {
      forms.number.pattern.exec(sample)[0].should.equal(sample);
    }
  });
  it('has `string` form', function () {
    // can be called
    forms.string('hello world');

    // has a pattern defined
    forms.string.pattern.should.not.be.undefined();

    // validate the pattern
    let ok_samples = ['"1', '"a string'];
    for (const sample of ok_samples) {
      forms.string.pattern.exec(sample)[0].should.equal(sample);
    }
  });
  it('has `literal` form', function () {
    // can be called
    forms.literal('true');

    // has a pattern defined
    forms.literal.pattern.should.not.be.undefined();

    // validate the pattern
    let ok_samples = ['true', 'false', 'nil'];
    for (const sample of ok_samples) {
      forms.literal.pattern.exec(sample)[0].should.equal(sample);
    }
  });
  it('has `symbol` form', function () {
    // can be called
    forms.symbol('a');

    // has a pattern defined
    forms.symbol.pattern.should.not.be.undefined();

    // validate the pattern
    let ok_samples = ['a', 'my_var', '+', '_x'];
    for (const sample of ok_samples) {
      forms.symbol.pattern.exec(sample)[0].should.equal(sample);
    }
  });
  it('has `keyword` form', function () {
    // can be called
    forms.keyword(':name');

    // has a pattern defined
    forms.keyword.pattern.should.not.be.undefined();

    // validate the pattern
    let ok_samples = [':a', ':name', '::date'];
    for (const sample of ok_samples) {
      forms.keyword.pattern.exec(sample)[0].should.equal(sample);
    }
  });
  it('has `vector` form', function () {
    // can be called
    forms.vector('[1, 2]');

    // has a pattern defined
    forms.vector.pattern.should.not.be.undefined();

    // validate the pattern
    let ok_samples = ['[]', '[1 2]'];
    for (const sample of ok_samples) {
      forms.vector.pattern.exec(sample)[0].should.equal('[');
    }
  });
  it('has `call` form', function () {
    // can be called
    forms.call('(+ 1 2)');

    // has a pattern defined
    forms.call.pattern.should.not.be.undefined();

    // validate the pattern
    let ok_samples = ['(+ 1 2)'];
    for (const sample of ok_samples) {
      forms.call.pattern.exec(sample)[0].should.equal('(');
    }
  });
  it('has `list` form', function () {
    // can be called
    forms.list('(1 2)');

    // has a pattern defined
    forms.list.pattern.should.not.be.undefined();

    // validate the pattern
    let ok_samples = ['(1 2)'];
    for (const sample of ok_samples) {
      forms.list.pattern.exec(sample)[0].should.equal('(');
    }
  });
  it('has `comment` form', function () {
    // can be called
    forms.comment('; comment');

    // has a pattern defined
    forms.comment.pattern.should.not.be.undefined();

    // validate the pattern
    let ok_samples = ['; my-comment'];
    for (const sample of ok_samples) {
      forms.comment.pattern.exec(sample)[0].should.equal(sample);
    }
  });
  it('has `hash_map` form', function () {
    // can be called
    forms.hash_map('{:a 1 :b 2}');

    // has a pattern defined
    forms.hash_map.pattern.should.not.be.undefined();

    // validate the pattern
    let ok_samples = ['{}', '{:a 1 :b 2}'];
    for (const sample of ok_samples) {
      forms.hash_map.pattern.exec(sample)[0].should.equal('{');
    }
  });
});
