import { CoreNamespaceFactory } from './core';

describe('Core', function () {
  it('raises error of evaluator is null when calling create', function () {
    var factory = new CoreNamespaceFactory(null, null);
    expect(function () {
      factory.create();
    }).toThrowError('Evaluator is required to create core namespace');
  });
});
