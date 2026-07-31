import { MetricsListener } from '../../src/events';
import { EventBus } from '../../src/events';

describe('MetricsListener', () => {
  it('计数请求/成功/失败', () => {
    const bus = new EventBus();
    const metrics = new MetricsListener();
    bus.subscribeAll(metrics.handler);

    bus.publish('request_started', { model: 'kimi' }, 'r1');
    bus.publish('request_started', { model: 'deepseek' }, 'r2');
    bus.publish('request_completed', { success: true, latencyMs: 100 }, 'r1');
    bus.publish('request_completed', { success: false, latencyMs: 200 }, 'r2');
    bus.publish('rate_limited', {}, 'r3');
    bus.publish('circuit_opened', { providerKey: 'moonshot' }, 'r4');

    const snap = metrics.snapshot();
    expect(snap.totalRequests).toBe(2);
    expect(snap.successCount).toBe(1);
    expect(snap.errorCount).toBe(1);
    expect(snap.rateLimitedCount).toBe(1);
    expect(snap.circuitOpenedTotal).toBe(1);
    expect(snap.modelRequests['kimi']).toBe(1);
  });

  it('provider 失败计数', () => {
    const bus = new EventBus();
    const metrics = new MetricsListener();
    bus.subscribeAll(metrics.handler);
    bus.publish('provider_failed', { providerKey: 'moonshot' });
    const snap = metrics.snapshot();
    expect(snap.providerFailures['moonshot']).toBe(1);
  });

  it('reset 清空', () => {
    const metrics = new MetricsListener();
    metrics.reset();
    const snap = metrics.snapshot();
    expect(snap.totalRequests).toBe(0);
  });
});
