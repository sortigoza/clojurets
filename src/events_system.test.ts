import { events, EventType } from './events';

describe('EventsSystem', function () {
  test('can subscribe and unsubscribe to events', function () {
    let capture_events = [];
    const call_back = events.subscribe(EventType.INFO_UPDATED, (data) => {});

    events.unsubscribe(EventType.INFO_UPDATED, call_back);
  });

  test('can publish when no subscribers', function () {
    const res = events.publish(EventType.INFO_UPDATED, 'hello');
    expect(res).toEqual(false);
  });

  test('can publish with subscribers', function () {
    let capture_events = [];
    events.subscribe(EventType.INFO_UPDATED, (data) => {
      capture_events.push(data);
    });
    const res = events.publish(EventType.INFO_UPDATED, 'hello');

    expect(res).toEqual(true);
    expect(capture_events[0]).toEqual('hello');
  });
});
