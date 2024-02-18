import { clojure } from '../clojure';
import { Namespace } from '../namespace';

describe('Namespace', function () {
  it('ns', function () {
    clojure.run('(ns some-namespace)');

    expect(clojure.namespaceRegistry.getCurrent().name).toEqual('some-namespace');
  });

  it('resets namespace registry correctly', () => {
    clojure.namespaceRegistry.reset();
    expect(clojure.namespaceRegistry.getCurrent().name).toEqual('user');
    expect(clojure.namespaceRegistry.all).toHaveProperty('user');
  });

  it('can set and get from the namespace registry', function () {
    clojure.namespaceRegistry.reset();
    expect(clojure.namespaceRegistry.get('user').name).toEqual('user');
    clojure.namespaceRegistry.set('new-namespace');
    expect(clojure.namespaceRegistry.get('new-namespace').name).toEqual('new-namespace');
  });

  it('new namespace initialization', function () {
    const namespace = new Namespace('ns-init');
    expect(namespace.name).toEqual('ns-init');
    expect(namespace.vars).toEqual({});
  });

  it('can set and get namespace symbols', function () {
    const namespace = new Namespace('get-set');
    namespace.set('a', 5);
    expect(namespace.get('a')).toEqual(5);
  });

  it('can extend a namespace', function () {
    const ns1 = new Namespace('first-ns');
    ns1.set('a', 5);
    const ns2 = ns1.extend();

    // both have `a` defined
    expect(ns1.get('a')).toEqual(5);
    expect(ns2.get('a')).toEqual(5);

    // a new definition on the extended ns does not affect the first
    ns2.set('b', 3);
    expect(ns2.get('b')).toEqual(3);
    expect(typeof ns1.get('b')).toEqual('undefined');
  });

  it('can use a namespace', function () {
    const ns1 = new Namespace('first-ns');
    const ns2 = new Namespace('second-ns');
    ns1.set('a', 5);
    ns2.set('b', 3);

    // `a` is not yet defined
    expect(typeof ns2.get('a')).toEqual('undefined');
    // `a` is injected into `ns2`
    ns2.use(ns1);
    expect(ns2.get('a')).toEqual(5);
    expect(ns2.get('b')).toEqual(3);
  });
});
