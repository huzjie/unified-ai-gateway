import { LimiterManager, TokenBucket, ConcurrencyLimiter } from '../../src/rate-limiter';
import type { RateLimitScope, RequestContext } from '@uag/types';

describe('LimiterManager', () => {
  const qps = new TokenBucket();
  const conc = new ConcurrencyLimiter();
  const manager = new LimiterManager(qps, conc);
  const scope: RateLimitScope = { kind: 'key', id: 'k1', qps: 2, burst: 2, concurrency: 1 };

  beforeEach(() => qps.clear());

  function makeCtx(): RequestContext {
    return {
      requestId: 'r', apiKey: { id: 'k1', tenant: 't', keyHash: '', salt: 's', keyPrefix: '', status: 'active', name: '', modelWhitelist: [], qpsLimit: 2, concurrencyLimit: 1, monthlyQuotaTokens: 0, monthlyQuotaAmount: 0, expiresAt: null, createdAt: new Date().toISOString(), lastUsedAt: null, revokedAt: null },
      tenant: 't', ip: '127.0.0.1', virtualModel: 'm', payload: { model: 'm', messages: [] },
      routeDecision: null, usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }, cost: null,
      stream: false, headers: {}, startedAt: Date.now(),
    };
  }

  it('QPS 限制生效', () => {
    expect(manager.check(scope).allowed).toBe(true);
    expect(manager.check(scope).allowed).toBe(true);
    expect(manager.check(scope).allowed).toBe(false);
  });

  it('并发限制生效', async () => {
    const ctx = makeCtx();
    expect((await manager.acquire(ctx)).allowed).toBe(true);
    const denied = await manager.acquire(makeCtx());
    expect(denied.allowed).toBe(false);
    manager.release(ctx);
  });
});
