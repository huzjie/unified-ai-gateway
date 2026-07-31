import type { ApiKeyEntity, KeyFilter, KeyPatch, NewApiKey, Page, PageResult } from '@uag/types';
import type { SQLiteConnection } from '../connection/sqlite-connection';
import { BaseRepository } from './base-repository';
import type { IApiKeyRepository } from './interfaces/api-key-repository.interface';
import { Serializer } from '../services/serializer';
import { Paginator } from '../services/paginator';
import { IdGenerator } from '../services/id-generator';

interface ApiKeyRow {
  id: string;
  name: string;
  tenant: string;
  key_hash: string;
  salt: string;
  key_prefix: string;
  status: string;
  model_whitelist_json: string;
  qps_limit: number;
  concurrency_limit: number;
  monthly_quota_tokens: number;
  monthly_quota_amount: number;
  expires_at: string | null;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
}

function toEntity(row: ApiKeyRow): ApiKeyEntity {
  return {
    id: row.id,
    name: row.name,
    tenant: row.tenant,
    keyHash: row.key_hash,
    salt: row.salt,
    keyPrefix: row.key_prefix,
    status: row.status as ApiKeyEntity['status'],
    modelWhitelist: Serializer.stringArray(row.model_whitelist_json),
    qpsLimit: row.qps_limit,
    concurrencyLimit: row.concurrency_limit,
    monthlyQuotaTokens: row.monthly_quota_tokens,
    monthlyQuotaAmount: row.monthly_quota_amount,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    lastUsedAt: row.last_used_at,
    revokedAt: row.revoked_at,
  };
}

export class ApiKeyRepository extends BaseRepository implements IApiKeyRepository {
  protected readonly table = 'api_keys';

  constructor(conn: SQLiteConnection) {
    super(conn);
  }

  create(input: NewApiKey & { keyHash: string; salt: string; keyPrefix: string }): ApiKeyEntity {
    const now = new Date().toISOString();
    const id = IdGenerator.apiKey();
    this.insertRow(this.table, {
      id,
      name: input.name,
      tenant: input.tenant,
      key_hash: input.keyHash,
      salt: input.salt,
      key_prefix: input.keyPrefix,
      status: 'active',
      model_whitelist_json: Serializer.serialize(input.modelWhitelist ?? []),
      qps_limit: input.qpsLimit ?? 100,
      concurrency_limit: input.concurrencyLimit ?? 20,
      monthly_quota_tokens: input.monthlyQuotaTokens ?? 0,
      monthly_quota_amount: input.monthlyQuotaAmount ?? 0,
      expires_at: input.expiresAt ?? null,
      created_at: now,
      last_used_at: null,
      revoked_at: null,
    });
    return this.findById(id)!;
  }

  findByHash(hash: string): ApiKeyEntity | null {
    return this.findOne<ApiKeyRow>('key_hash = ?', [hash]) ? toEntity(this.findOne<ApiKeyRow>('key_hash = ?', [hash])!) : null;
  }

  findById(id: string): ApiKeyEntity | null {
    const row = this.findOne<ApiKeyRow>('id = ?', [id]);
    return row ? toEntity(row) : null;
  }

  list(filter: KeyFilter, page: Page): PageResult<ApiKeyEntity> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (filter.tenant) {
      conditions.push('tenant = ?');
      params.push(filter.tenant);
    }
    if (filter.status) {
      conditions.push('status = ?');
      params.push(filter.status);
    }
    if (filter.search) {
      conditions.push('(name LIKE ? OR tenant LIKE ? OR key_prefix LIKE ?)');
      const kw = `%${filter.search}%`;
      params.push(kw, kw, kw);
    }
    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const total = this.count(where, params);
    const p = Paginator.normalize(page.page, page.pageSize);
    const offset = (p.page - 1) * p.pageSize;
    const rows = this.findMany<ApiKeyRow>(
      where,
      [...params, p.pageSize, offset],
      `ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    );
    return Paginator.wrap(rows.map(toEntity), total, p);
  }

  revoke(id: string, at: string): void {
    this.conn
      .prepare(`UPDATE api_keys SET status = 'revoked', revoked_at = ? WHERE id = ?`)
      .run(at, id);
  }

  update(id: string, patch: KeyPatch): ApiKeyEntity {
    const data: Record<string, unknown> = {};
    if (patch.name !== undefined) data.name = patch.name;
    if (patch.modelWhitelist !== undefined) data.model_whitelist_json = Serializer.serialize(patch.modelWhitelist);
    if (patch.qpsLimit !== undefined) data.qps_limit = patch.qpsLimit;
    if (patch.concurrencyLimit !== undefined) data.concurrency_limit = patch.concurrencyLimit;
    if (patch.monthlyQuotaTokens !== undefined) data.monthly_quota_tokens = patch.monthlyQuotaTokens;
    if (patch.monthlyQuotaAmount !== undefined) data.monthly_quota_amount = patch.monthlyQuotaAmount;
    if (patch.expiresAt !== undefined) data.expires_at = patch.expiresAt;
    this.updateRow(this.table, id, data);
    return this.findById(id)!;
  }

  touchLastUsed(id: string, at: string): void {
    this.conn.prepare(`UPDATE api_keys SET last_used_at = ? WHERE id = ?`).run(at, id);
  }
}
