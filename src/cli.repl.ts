'use strict';
import { clojure } from './clojure';

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Welcome to the clojurejs REPL! Type (quit) to quit');

rl.on('line', readEvalPrompt);

rl.on('close', function () {
  process.exit(0);
});

prompt();

let total_input = '';

function readEvalPrompt(input) {
  let result;

  if (input.trim().startsWith(';')) {
    // skip comments
    total_input = total_input + '\n';
  } else {
    total_input = total_input + input + '\n';
  }
  if (total_input.slice(total_input.length - 2) !== '\n\n') {
    promptMoreInput();
    return;
  }

  total_input = total_input.trim().replace(/(\r\n|\n|\r)/gm, ' ');

  if (total_input === '(quit)') {
    console.log('Bye!');
    process.exit(0);
  }
  try {
    result = clojure.run(total_input).toString();

    if (result !== undefined) {
      console.log(result);
    }
  } catch (error) {
    console.log('Error: ', error);
  }

  total_input = '';
  prompt();
}

function prompt() {
  const prefix = clojure.namespaceRegistry.getCurrent().name + '=> ';
  rl.setPrompt(prefix, prefix.length);
  rl.prompt();
}

function promptMoreInput() {
  const prefix = clojure.namespaceRegistry.getCurrent().name + '+> ';
  rl.setPrompt(prefix, prefix.length);
  rl.prompt();
}
