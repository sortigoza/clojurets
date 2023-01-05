import { Namespace } from '../../src/namespace';
import { clojure } from '../../src/clojure';

import * as should from 'should';

describe('Namespace', function () {
  it('ns', function () {
    clojure.run('(ns some-namespace)');

    Namespace.current.name.should.equal('some-namespace');
  });

  it('resets namespace registry correctly', function () {
    Namespace.reset();
    Namespace.current.name.should.equal('user');
    Namespace.all.should.have.key('user');
  });

  it('can set and get from the namespace registry', function () {
    Namespace.reset();
    Namespace.get('user').name.should.equal('user');
    Namespace.set('new-namespace');
    Namespace.get('new-namespace').name.should.equal('new-namespace');
  });

  it('new namespace initialization', function () {
    const namespace = new Namespace('ns-init');
    namespace.name.should.equal('ns-init');
    namespace.vars.should.eql({});
  });

  it('can set and get namespace symbols', function () {
    const namespace = new Namespace('get-set');
    namespace.set('a', 5);
    namespace.get('a').should.equal(5);
  });

  it('can extend a namespace', function () {
    const ns1 = new Namespace('first-ns');
    ns1.set('a', 5);
    const ns2 = ns1.extend();

    // both have `a` defined
    ns1.get('a').should.equal(5);
    ns2.get('a').should.equal(5);

    // a new definition on the extended ns does not affect the first
    ns2.set('b', 3);
    ns2.get('b').should.equal(3);
    (typeof ns1.get('b')).should.equal('undefined');
  });

  it('can use a namespace', function () {
    const ns1 = new Namespace('first-ns');
    const ns2 = new Namespace('second-ns');
    ns1.set('a', 5);
    ns2.set('b', 3);

    // `a` is not yet defined
    (typeof ns2.get('a')).should.equal('undefined');
    // `a` is injected into `ns2`
    ns2.use(ns1);
    ns2.get('a').should.equal(5);
    ns2.get('b').should.equal(3);
  });
});
