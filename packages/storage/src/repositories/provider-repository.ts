import type { NewProvider, Page, PageResult, ProviderEntity, ProviderPatch } from '@uag/types';
import type { SQLiteConnection } from '../connection/sqlite-connection';
import { BaseRepository } from './base-repository';
import type { IProviderRepository } from './interfaces/provider-repository.interface';
import { Serializer } from '../services/serializer';
import { Paginator } from '../services/paginator';
import { IdGenerator } from '../services/id-generator';

interface ProviderRow {
  id: string;
  name: string;
  type: string;
  base_url: string;
  encrypted_api_key: string | null;
  models_json: string;
  pricing_json: string;
  timeout_ms: number;
  max_retries: number;
  enabled: number;
  health_status: string;
  created_at: string;
  updated_at: string;
}

function toEntity(row: ProviderRow): ProviderEntity {
  return {
    id: row.id,
    name: row.name,
    type: row.type as ProviderEntity['type'],
    baseUrl: row.base_url,
    encryptedApiKey: row.encrypted_api_key,
    models: Serializer.stringArray(row.models_json),
    pricing: Serializer.record(row.pricing_json),
    timeoutMs: row.timeout_ms,
    maxRetries: row.max_retries,
    enabled: row.enabled === 1 ? 'enabled' : 'disabled',
    healthStatus: row.health_status as ProviderEntity['healthStatus'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class ProviderRepository extends BaseRepository implements IProviderRepository {
  protected readonly table = 'providers';

  constructor(conn: SQLiteConnection) {
    super(conn);
  }

  create(input: NewProvider & { encryptedApiKey: string | null }): ProviderEntity {
    const now = new Date().toISOString();
    const id = IdGenerator.provider();
    this.insertRow(this.table, {
      id,
      name: input.name,
      type: input.type,
      base_url: input.baseUrl,
      encrypted_api_key: input.encryptedApiKey,
      models_json: Serializer.serialize(input.models ?? []),
      pricing_json: Serializer.serialize(input.pricing ?? {}),
      timeout_ms: input.timeoutMs ?? 30000,
      max_retries: input.maxRetries ?? 2,
      enabled: (input.enabled ?? 'enabled') === 'enabled' ? 1 : 0,
      health_status: 'unknown',
      created_at: now,
      updated_at: now,
    });
    return this.findById(id)!;
  }

  findById(id: string): ProviderEntity | null {
    const row = this.findOne<ProviderRow>('id = ?', [id]);
    return row ? toEntity(row) : null;
  }

  findByName(name: string): ProviderEntity | null {
    const row = this.findOne<ProviderRow>('name = ?', [name]);
    return row ? toEntity(row) : null;
  }

  list(filter: { type?: string; enabled?: boolean; search?: string }, page: Page): PageResult<ProviderEntity> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (filter.type) {
      conditions.push('type = ?');
      params.push(filter.type);
    }
    if (filter.enabled !== undefined) {
      conditions.push('enabled = ?');
      params.push(filter.enabled ? 1 : 0);
    }
    if (filter.search) {
      conditions.push('(name LIKE ? OR base_url LIKE ?)');
      const kw = `%${filter.search}%`;
      params.push(kw, kw);
    }
    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const total = this.count(where, params);
    const p = Paginator.normalize(page.page, page.pageSize);
    const offset = (p.page - 1) * p.pageSize;
    const rows = this.conn
      .prepare(`SELECT * FROM providers ${where} ORDER BY created_at ASC LIMIT ? OFFSET ?`)
      .all(...params, p.pageSize, offset) as ProviderRow[];
    return Paginator.wrap(rows.map(toEntity), total, p);
  }

  listAll(): ProviderEntity[] {
    const rows = this.conn.prepare('SELECT * FROM providers ORDER BY created_at ASC').all() as ProviderRow[];
    return rows.map(toEntity);
  }

  update(id: string, patch: ProviderPatch & { encryptedApiKey?: string | null }): ProviderEntity {
    const data: Record<string, unknown> = {};
    if (patch.name !== undefined) data.name = patch.name;
    if (patch.baseUrl !== undefined) data.base_url = patch.baseUrl;
    if (patch.encryptedApiKey !== undefined) data.encrypted_api_key = patch.encryptedApiKey;
    if (patch.models !== undefined) data.models_json = Serializer.serialize(patch.models);
    if (patch.pricing !== undefined) data.pricing_json = Serializer.serialize(patch.pricing);
    if (patch.timeoutMs !== undefined) data.timeout_ms = patch.timeoutMs;
    if (patch.maxRetries !== undefined) data.max_retries = patch.maxRetries;
    if (patch.enabled !== undefined) data.enabled = patch.enabled === 'enabled' ? 1 : 0;
    this.updateRow(this.table, id, data);
    return this.findById(id)!;
  }

  delete(id: string): void {
    this.deleteRow(this.table, id);
  }

  updateHealth(id: string, status: string): void {
    this.conn.prepare(`UPDATE providers SET health_status = ? WHERE id = ?`).run(status, id);
  }
}
