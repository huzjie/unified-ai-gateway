import type { LogFilter, Page, PageResult, UsageLog } from '@uag/types';
import type { SQLiteConnection } from '../connection/sqlite-connection';
import { BaseRepository } from './base-repository';
import type { IUsageLogRepository } from './interfaces/usage-log-repository.interface';
import { Paginator } from '../services/paginator';
import { IdGenerator } from '../services/id-generator';

interface UsageLogRow {
  id: string;
  request_id: string;
  key_id: string | null;
  tenant: string;
  model: string;
  provider: string;
  provider_model: string;
  status_code: number;
  latency_ms: number;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cost_amount: number;
  currency: string;
  stream: number;
  cache_hit: number;
  error_code: string | null;
  error_message: string | null;
  created_at: string;
}

function toEntity(row: UsageLogRow): UsageLog {
  return {
    id: row.id,
    requestId: row.request_id,
    keyId: row.key_id,
    tenant: row.tenant,
    model: row.model,
    provider: row.provider,
    providerModel: row.provider_model,
    statusCode: row.status_code,
    latencyMs: row.latency_ms,
    promptTokens: row.prompt_tokens,
    completionTokens: row.completion_tokens,
    totalTokens: row.total_tokens,
    costAmount: row.cost_amount,
    currency: row.currency,
    stream: row.stream === 1,
    cacheHit: row.cache_hit === 1,
    errorCode: row.error_code,
    errorMessage: row.error_message,
    createdAt: row.created_at,
  };
}

export class UsageLogRepository extends BaseRepository implements IUsageLogRepository {
  protected readonly table = 'usage_logs';

  constructor(conn: SQLiteConnection) {
    super(conn);
  }

  insert(log: UsageLog): void {
    this.insertRow(this.table, {
      id: log.id ?? IdGenerator.log(),
      request_id: log.requestId,
      key_id: log.keyId,
      tenant: log.tenant,
      model: log.model,
      provider: log.provider,
      provider_model: log.providerModel,
      status_code: log.statusCode,
      latency_ms: log.latencyMs,
      prompt_tokens: log.promptTokens,
      completion_tokens: log.completionTokens,
      total_tokens: log.totalTokens,
      cost_amount: log.costAmount,
      currency: log.currency,
      stream: log.stream ? 1 : 0,
      cache_hit: log.cacheHit ? 1 : 0,
      error_code: log.errorCode,
      error_message: log.errorMessage,
      created_at: log.createdAt,
    });
  }

  findById(id: string): UsageLog | null {
    const row = this.findOne<UsageLogRow>('id = ?', [id]);
    return row ? toEntity(row) : null;
  }

  findByRequestId(requestId: string): UsageLog | null {
    const row = this.findOne<UsageLogRow>('request_id = ?', [requestId]);
    return row ? toEntity(row) : null;
  }

  query(filter: LogFilter, page: Page): PageResult<UsageLog> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (filter.keyId) {
      conditions.push('key_id = ?');
      params.push(filter.keyId);
    }
    if (filter.tenant) {
      conditions.push('tenant = ?');
      params.push(filter.tenant);
    }
    if (filter.model) {
      conditions.push('model = ?');
      params.push(filter.model);
    }
    if (filter.provider) {
      conditions.push('provider = ?');
      params.push(filter.provider);
    }
    if (filter.statusCode !== undefined) {
      conditions.push('status_code = ?');
      params.push(filter.statusCode);
    }
    if (filter.stream !== undefined) {
      conditions.push('stream = ?');
      params.push(filter.stream ? 1 : 0);
    }
    if (filter.cacheHit !== undefined) {
      conditions.push('cache_hit = ?');
      params.push(filter.cacheHit ? 1 : 0);
    }
    if (filter.startTime) {
      conditions.push('created_at >= ?');
      params.push(filter.startTime);
    }
    if (filter.endTime) {
      conditions.push('created_at <= ?');
      params.push(filter.endTime);
    }
    if (filter.search) {
      conditions.push('(request_id LIKE ? OR model LIKE ? OR provider LIKE ? OR error_message LIKE ?)');
      const kw = `%${filter.search}%`;
      params.push(kw, kw, kw, kw);
    }
    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const total = this.count(where, params);
    const p = Paginator.normalize(page.page, page.pageSize);
    const offset = (p.page - 1) * p.pageSize;
    const rows = this.conn
      .prepare(`SELECT * FROM usage_logs ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
      .all(...params, p.pageSize, offset) as UsageLogRow[];
    return Paginator.wrap(rows.map(toEntity), total, p);
  }

  /** 删除早于保留期的日志 */
  deleteOlderThan(iso: string): number {
    const result = this.conn.prepare(`DELETE FROM usage_logs WHERE created_at < ?`).run(iso);
    return result.changes;
  }

  /** 聚合区间 logs（供 stats 服务） */
  queryRange(filter: LogFilter): UsageLog[] {
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (filter.startTime) {
      conditions.push('created_at >= ?');
      params.push(filter.startTime);
    }
    if (filter.endTime) {
      conditions.push('created_at <= ?');
      params.push(filter.endTime);
    }
    if (filter.model) {
      conditions.push('model = ?');
      params.push(filter.model);
    }
    if (filter.provider) {
      conditions.push('provider = ?');
      params.push(filter.provider);
    }
    if (filter.tenant) {
      conditions.push('tenant = ?');
      params.push(filter.tenant);
    }
    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = this.conn.prepare(`SELECT * FROM usage_logs ${where} ORDER BY created_at ASC`).all(...params) as UsageLogRow[];
    return rows.map(toEntity);
  }
}
