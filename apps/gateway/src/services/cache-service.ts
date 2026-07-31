import type { RuntimeRegistry } from './runtime-registry';
import { createHash } from 'node:crypto';

/**
 * 上下文缓存读写（P1）
 */
export class CacheService {
  constructor(private readonly runtime: RuntimeRegistry) {}

  /** 计算缓存 key（请求指纹） */
  buildKey(model: string, messages: unknown[]): string {
    const raw = `${model}:${JSON.stringify(messages)}`;
    return `ctx:${createHash('sha256').update(raw).digest('hex')}`;
  }

  get(cacheKey: string): unknown | null {
    const entry = this.runtime.repos.contextCache.get(cacheKey);
    return entry ? entry.response : null;
  }

  set(cacheKey: string, model: string, response: unknown, promptTokens: number, completionTokens: number, ttlMs = 3600_000): void {
    this.runtime.repos.contextCache.set({ cacheKey, model, response, promptTokens, completionTokens, ttlMs });
  }
}
