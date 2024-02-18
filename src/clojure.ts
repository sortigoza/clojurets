import { buildInterpreter } from './interpreter_factory';

// this is the main obj to be used by external
// modules interfacing with the interpreter
export const clojure = buildInterpreter();

// when running in the browser attach the clojure obj to the window
if (typeof window !== 'undefined') {
  window.clojurets = clojure;
}
