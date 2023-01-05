import { expect } from 'chai';
import { events, EventType } from '../src/events';

describe('EventsSystem', function () {
  it('can subscribe and unsubscribe to events', function () {
    let capture_events = [];
    const call_back = events.subscribe(EventType.INFO_UPDATED, (data) => {});

    events.unsubscribe(EventType.INFO_UPDATED, call_back);
  });

  it('can publish when no subscribers', function () {
    const res = events.publish(EventType.INFO_UPDATED, 'hello');
    expect(res).to.equal(false);
  });

  it('can publish with subscribers', function () {
    let capture_events = [];
    events.subscribe(EventType.INFO_UPDATED, (data) => {
      capture_events.push(data);
    });
    const res = events.publish(EventType.INFO_UPDATED, 'hello');

    expect(res).to.equal(true);
    expect(capture_events[0]).to.equal('hello');
  });
});
