import { EventSubscriber } from '../../src/events';
import { EventBus } from '../../src/events';

describe('EventSubscriber', () => {
  it('批量订阅与取消', () => {
    const bus = new EventBus();
    const sub = new EventSubscriber(bus);
    const received: string[] = [];
    sub.on('rate_limited', (e) => received.push(e.type));
    sub.on('circuit_opened', (e) => received.push(e.type));
    bus.publish('rate_limited', {});
    bus.publish('circuit_opened', {});
    expect(received).toEqual(['rate_limited', 'circuit_opened']);
    sub.unsubscribeAll();
    bus.publish('rate_limited', {});
    expect(received.length).toBe(2);
  });
});
