import type { RateLimitScope } from '@uag/types';
import type { ApiKeyEntity } from '@uag/types';

/**
 * HTTP 请求 → 限流作用域
 */
export function resolveLimitScope(input: {
  apiKey?: ApiKeyEntity | null;
  tenant?: string;
  ip?: string;
  keyQps?: number;
  keyConcurrency?: number;
}): RateLimitScope[] {
  const scopes: RateLimitScope[] = [];
  if (input.apiKey) {
    scopes.push({
      kind: 'key',
      id: input.apiKey.id,
      qps: input.keyQps ?? input.apiKey.qpsLimit,
      burst: (input.keyQps ?? input.apiKey.qpsLimit) * 2,
      concurrency: input.keyConcurrency ?? input.apiKey.concurrencyLimit,
    });
  }
  if (input.tenant) {
    scopes.push({ kind: 'tenant', id: input.tenant, qps: 1000, burst: 2000, concurrency: 200 });
  }
  if (input.ip) {
    scopes.push({ kind: 'ip', id: input.ip, qps: 1000, burst: 2000, concurrency: 200 });
  }
  return scopes;
}
