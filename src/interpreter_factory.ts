import { Evaluator } from './evaluator';
import { events, EventType } from './events';
import { NamespaceRegistry } from './namespace_registry';
import { Reader } from './reader';

export function buildInterpreter() {
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

  return {
    run,
    evaluator,
    events,
    namespaceRegistry,
  };
}
