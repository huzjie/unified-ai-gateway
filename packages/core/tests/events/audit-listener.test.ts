import { EventBus } from '../../src/events';
import { AuditListener } from '../../src/events';

describe('AuditListener', () => {
  it('audit_logged 事件落库', async () => {
    const bus = new EventBus();
    const inserted: unknown[] = [];
    const listener = new AuditListener({ insert: async (log) => inserted.push(log) });
    bus.subscribeAll(listener.handler);
    bus.publish('audit_logged', { log: { id: 'a1', action: 'key.create' } });
    await new Promise((r) => setTimeout(r, 10));
    expect(inserted.length).toBe(1);
  });
});
