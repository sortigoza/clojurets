import { Evaluator } from './evaluator';
import { events, EventType } from './events';
import { NamespaceRegistry } from './namespace_registry';
import { Reader } from './reader';

const reader = new Reader();
const namespaceRegistry = new NamespaceRegistry();
const evaluator = new Evaluator(namespaceRegistry);
namespaceRegistry.initialize(evaluator);

function run(str) {
  const data = reader.read(str);
  events.publish(EventType.BEGIN_RUN_EVALUATION, { data });
  const result = evaluator.evaluate(data);
  events.publish(EventType.FINISH_RUN_EVALUATION, { result });
  return result;
}

// this is the main obj to be used by external
// modules interfacing with the interpreter
export const clojure = {
  run,
  events,
  namespaceRegistry: namespaceRegistry,
};

// when running in the browser attach the clojure obj to the window
if (typeof window !== 'undefined') {
  window.clojurejs = clojure;
}
