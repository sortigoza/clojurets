import { logger } from './logger';

export const enum EventType {
  INFO_UPDATED = 'INFO_UPDATED',
  BEGIN_EVALUATE_EXPRESSION = 'BEGIN_EVALUATE_EXPRESSION',
  FINISH_EVALUATE_EXPRESSION = 'FINISH_EVALUATE_EXPRESSION',
  EVALUATE_EXPRESSION_FAILED = 'EVALUATE_EXPRESSION_FAILED',
  NAMESPACES_RESET = 'NAMESPACES_RESET',
  BEGIN_RUN_EVALUATION = 'BEGIN_RUN_EVALUATION',
  FINISH_RUN_EVALUATION = 'FINISH_RUN_EVALUATION',
}

type DATA_INFO_UPDATED = string;

type IEventCallback<T> = (data: T) => void;

interface IEventSubscribers {
  [eventType: number]: Array<IEventCallback<any>> | undefined;
}

class EventSystem {
  private subscribers: IEventSubscribers = {};

  public publish<T>(event: EventType, data: T): boolean {
    // logger.debug({ event, data }, 'new-event-published');

    const queue = this.subscribers[event];

    if (!queue || queue.length === 0) {
      return false;
    }

    for (const cb of queue) {
      cb(data);
    }

    return true;
  }

  public subscribe<T>(event: EventType, callback: IEventCallback<T>): IEventCallback<T> {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }

    this.subscribers[event]!.push(callback);

    // Return the callback so we can unsubscribe from it
    // This way we can pass an arrow function
    return callback;
  }

  public unsubscribe(event: EventType, callback?: IEventCallback<any>) {
    const subs = this.subscribers[event];

    if (!subs) {
      return;
    }

    if (!callback) {
      this.subscribers[event] = undefined;
    } else {
      this.subscribers[event] = this.subscribers[event]!.filter((subCb) => {
        return subCb !== callback;
      });
    }
  }
}

export const events = new EventSystem();
