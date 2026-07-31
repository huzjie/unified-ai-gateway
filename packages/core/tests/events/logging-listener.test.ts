import { EventBus } from '../../src/events';
import { LoggingListener } from '../../src/events';
import { createNullLogger } from '../../src/utils';

describe('LoggingListener', () => {
  it('usage_recorded 事件落库', async () => {
    const bus = new EventBus();
    const inserted: unknown[] = [];
    const upserted: unknown[] = [];
    const listener = new LoggingListener(
      {
        insert: async (log) => inserted.push(log),
        upsertDailyStats: async (log) => upserted.push(log),
      },
      createNullLogger(),
    );
    bus.subscribeAll(listener.handler);
    bus.publish('usage_recorded', { log: { id: 'l1', model: 'm' } });
    await new Promise((r) => setTimeout(r, 10));
    expect(inserted.length).toBe(1);
    expect(upserted.length).toBe(1);
  });
});
