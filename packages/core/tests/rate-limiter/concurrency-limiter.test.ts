import { ConcurrencyLimiter } from '../../src/rate-limiter';
import type { RequestContext } from '@uag/types';

function makeCtx(keyId: string): RequestContext {
  return {
    requestId: 'r',
    apiKey: { id: keyId, tenant: 't', keyHash: '', salt: 's', keyPrefix: '', status: 'active', name: '', modelWhitelist: [], qpsLimit: 10, concurrencyLimit: 2, monthlyQuotaTokens: 0, monthlyQuotaAmount: 0, expiresAt: null, createdAt: new Date().toISOString(), lastUsedAt: null, revokedAt: null },
    tenant: 't',
    ip: '127.0.0.1',
    virtualModel: 'm',
    payload: { model: 'm', messages: [] },
    routeDecision: null,
    usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    cost: null,
    stream: false,
    headers: {},
    startedAt: Date.now(),
  };
}

describe('ConcurrencyLimiter', () => {
  const limiter = new ConcurrencyLimiter();

  it('并发槽占用与释放', async () => {
    const ctx1 = makeCtx('k1');
    const ctx2 = makeCtx('k1');
    expect((await limiter.acquire(ctx1)).allowed).toBe(true);
    expect((await limiter.acquire(ctx2)).allowed).toBe(true);
    // 第三个超过 concurrencyLimit=2
    const ctx3 = makeCtx('k1');
    const denied = await limiter.acquire(ctx3);
    expect(denied.allowed).toBe(false);
    expect(denied.limitType).toBe('concurrency');

    limiter.release(ctx1);
    expect((await limiter.acquire(makeCtx('k1'))).allowed).toBe(true);
  });

  it('不同 key 并发隔离', async () => {
    const a = makeCtx('kA');
    const b = makeCtx('kB');
    expect((await limiter.acquire(a)).allowed).toBe(true);
    expect((await limiter.acquire(a)).allowed).toBe(true);
    expect((await limiter.acquire(b)).allowed).toBe(true);
  });

  it('reset 清空', async () => {
    const ctx = makeCtx('kR');
    await limiter.acquire(ctx);
    await limiter.acquire(ctx);
    limiter.reset({ kind: 'key', id: 'kR', qps: 0, concurrency: 2 });
    expect((await limiter.acquire(makeCtx('kR'))).allowed).toBe(true);
  });
});
