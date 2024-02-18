#!/usr/bin/env npx ts-node
/*
The interpreter can be embeded in a node script or application.
This is an example of how to use the interpreter in a node script.
*/

import { forms } from '../src/forms';
import { buildInterpreter } from '../src/interpreter_factory';

const number = forms.number,
  string = forms.string,
  literal = forms.literal,
  symbol = forms.symbol,
  vector = forms.vector,
  keyword = forms.keyword,
  hash_map = forms.hash_map,
  list = forms.list,
  call = forms.call;

const clojurets = buildInterpreter();

// Run a simple expression
const res1 = clojurets.run('(+ 1 2)');
console.log(res1); // 3

// Define a variable and recall it
clojurets.run('(def x "Hello, World!")');
const res2 = clojurets.run('x');
console.log(res2);

// Operate with forms directly
const res3 = clojurets.evaluator.evaluate([call(symbol('*'), number(2), number(3))]);
console.log(res3); // 6
