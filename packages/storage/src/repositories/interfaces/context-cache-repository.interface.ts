import type { CacheEntry } from '../context-cache-repository';

export interface IContextCacheRepository {
  get(cacheKey: string): CacheEntry | null;
  set(input: {
    cacheKey: string;
    model: string;
    response: unknown;
    promptTokens: number;
    completionTokens: number;
    ttlMs?: number;
  }): CacheEntry;
  hit(cacheKey: string): CacheEntry | null;
  delete(id: string): void;
  deleteByKey(cacheKey: string): void;
  deleteExpired(): number;
}
