import { NamespaceRegistry } from './namespace_registry';

describe('NamespaceRegistry', function () {
  it('raises error if set called not initialized', function () {
    var factory = new NamespaceRegistry();
    expect(function () {
      factory.set('test');
    }).toThrowError('NamespaceRegistry is not initialized');
  });
});
