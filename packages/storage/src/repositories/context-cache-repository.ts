import type { ISODateTime } from '@uag/types';
import type { SQLiteConnection } from '../connection/sqlite-connection';
import { BaseRepository } from './base-repository';
import type { IContextCacheRepository } from './interfaces/context-cache-repository.interface';
import { Serializer } from '../services/serializer';
import { IdGenerator } from '../services/id-generator';

interface CacheRow {
  id: string;
  cache_key: string;
  model: string;
  response_json: string;
  prompt_tokens: number;
  completion_tokens: number;
  hits: number;
  created_at: string;
  expires_at: string | null;
  last_hit_at: string | null;
}

export interface CacheEntry {
  id: string;
  cacheKey: string;
  model: string;
  response: unknown;
  promptTokens: number;
  completionTokens: number;
  hits: number;
  createdAt: string;
  expiresAt: ISODateTime | null;
  lastHitAt: ISODateTime | null;
}

export class ContextCacheRepository extends BaseRepository implements IContextCacheRepository {
  protected readonly table = 'context_cache';

  constructor(conn: SQLiteConnection) {
    super(conn);
  }

  get(cacheKey: string): CacheEntry | null {
    const row = this.findOne<CacheRow>('cache_key = ?', [cacheKey]);
    if (!row) {
      return null;
    }
    // 过期清理
    if (row.expires_at && row.expires_at < new Date().toISOString()) {
      this.delete(row.id);
      return null;
    }
    return this.toEntry(row);
  }

  set(input: {
    cacheKey: string;
    model: string;
    response: unknown;
    promptTokens: number;
    completionTokens: number;
    ttlMs?: number;
  }): CacheEntry {
    const now = new Date().toISOString();
    const id = IdGenerator.cache();
    const expiresAt = input.ttlMs ? new Date(Date.now() + input.ttlMs).toISOString() : null;
    this.insertRow(this.table, {
      id,
      cache_key: input.cacheKey,
      model: input.model,
      response_json: Serializer.serialize(input.response),
      prompt_tokens: input.promptTokens,
      completion_tokens: input.completionTokens,
      hits: 0,
      created_at: now,
      expires_at: expiresAt,
      last_hit_at: now,
    });
    return this.get(input.cacheKey)!;
  }

  hit(cacheKey: string): CacheEntry | null {
    const row = this.findOne<CacheRow>('cache_key = ?', [cacheKey]);
    if (!row) {
      return null;
    }
    this.conn
      .prepare(`UPDATE context_cache SET hits = hits + 1, last_hit_at = ? WHERE cache_key = ?`)
      .run(new Date().toISOString(), cacheKey);
    return this.get(cacheKey);
  }

  delete(id: string): void {
    this.deleteRow(this.table, id);
  }

  deleteByKey(cacheKey: string): void {
    this.conn.prepare(`DELETE FROM context_cache WHERE cache_key = ?`).run(cacheKey);
  }

  deleteExpired(): number {
    const result = this.conn
      .prepare(`DELETE FROM context_cache WHERE expires_at IS NOT NULL AND expires_at < ?`)
      .run(new Date().toISOString());
    return result.changes;
  }

  private toEntry(row: CacheRow): CacheEntry {
    return {
      id: row.id,
      cacheKey: row.cache_key,
      model: row.model,
      response: Serializer.deserialize(row.response_json, null),
      promptTokens: row.prompt_tokens,
      completionTokens: row.completion_tokens,
      hits: row.hits,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      lastHitAt: row.last_hit_at,
    };
  }
}
