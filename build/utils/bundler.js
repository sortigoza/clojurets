/*global "console": true */

var fs = require('fs'),
  browserify = require('browserify'),
  validator = require('./validator'),
  minifier = require('./minifier');
module.exports.bundle = function (options, callback) {
  var bundle = browserify({ watch: options.watch });

  bundle.register(validator);

  if (!options.debug) {
    bundle.register('post', minifier);
  }

  bundle.prepend('(function () {');
  bundle.addEntry(options.source);
  bundle.append('})()');

  bundle.on('syntaxError', function (err) {
    console.error(err);
    throw err;
  });

  bundle.on('bundle', function () {
    callback(bundle.bundle());
  });

  callback(bundle.bundle());
};
