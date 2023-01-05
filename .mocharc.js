module.exports = {
  diff: true,
  extension: ['ts', 'js'],
  package: './package.json',
  reporter: 'spec',
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  require: ['ts-node/register', 'should', 'sinon'],
};
