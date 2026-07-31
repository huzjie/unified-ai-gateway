import { EventBus } from '../../src/events';

describe('EventBus', () => {
  it('发布/订阅', () => {
    const bus = new EventBus();
    const received: string[] = [];
    bus.subscribe('rate_limited', (event) => {
      received.push(event.payload as string);
    });
    bus.publish('rate_limited', 'hello');
    expect(received).toEqual(['hello']);
  });

  it('多类型订阅', () => {
    const bus = new EventBus();
    const types: string[] = [];
    bus.subscribe(['circuit_opened', 'circuit_closed'], (event) => types.push(event.type));
    bus.publish('circuit_opened', {});
    bus.publish('circuit_closed', {});
    expect(types).toEqual(['circuit_opened', 'circuit_closed']);
  });

  it('退订', () => {
    const bus = new EventBus();
    let count = 0;
    const unsub = bus.subscribe('usage_recorded', () => {
      count += 1;
    });
    bus.publish('usage_recorded', {});
    unsub();
    bus.publish('usage_recorded', {});
    expect(count).toBe(1);
  });

  it('handler 抛错不影响其他', () => {
    const bus = new EventBus();
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const received: string[] = [];
    bus.subscribe('usage_recorded', () => {
      throw new Error('boom');
    });
    bus.subscribe('usage_recorded', (event) => {
      received.push(event.type);
    });
    bus.publish('usage_recorded', {});
    expect(received).toEqual(['usage_recorded']);
    spy.mockRestore();
  });

  it('subscribeAll 通配', () => {
    const bus = new EventBus();
    const types: string[] = [];
    bus.subscribeAll((event) => types.push(event.type));
    bus.publish('cache_hit', {});
    bus.publish('cache_miss', {});
    expect(types).toEqual(['cache_hit', 'cache_miss']);
  });

  it('事件包含 id/timestamp', () => {
    const bus = new EventBus();
    const event = bus.publish('provider_failed', { providerKey: 'x' }, 'req-1');
    expect(event.id).toBeTruthy();
    expect(event.timestamp).toBeTruthy();
    expect(event.requestId).toBe('req-1');
  });

  it('clear 清空订阅', () => {
    const bus = new EventBus();
    let count = 0;
    bus.subscribe('usage_recorded', () => {
      count += 1;
    });
    bus.clear();
    bus.publish('usage_recorded', {});
    expect(count).toBe(0);
  });
});
