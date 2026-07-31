import type { AuditFilter, AuditLog, Page, PageResult } from '@uag/types';
import type { SQLiteConnection } from '../connection/sqlite-connection';
import { BaseRepository } from './base-repository';
import type { IAuditLogRepository } from './interfaces/audit-log-repository.interface';
import { Paginator } from '../services/paginator';
import { IdGenerator } from '../services/id-generator';

interface AuditLogRow {
  id: string;
  actor_type: string;
  actor_id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  detail_json: string | null;
  ip: string | null;
  user_agent: string | null;
  result: string;
  created_at: string;
}

function toEntity(row: AuditLogRow): AuditLog {
  return {
    id: row.id,
    actorType: row.actor_type as AuditLog['actorType'],
    actorId: row.actor_id,
    action: row.action,
    resourceType: row.resource_type,
    resourceId: row.resource_id,
    detailJson: row.detail_json,
    ip: row.ip,
    userAgent: row.user_agent,
    result: row.result as AuditLog['result'],
    createdAt: row.created_at,
  };
}

export class AuditLogRepository extends BaseRepository implements IAuditLogRepository {
  protected readonly table = 'audit_logs';

  constructor(conn: SQLiteConnection) {
    super(conn);
  }

  insert(log: AuditLog): void {
    this.insertRow(this.table, {
      id: log.id ?? IdGenerator.audit(),
      actor_type: log.actorType,
      actor_id: log.actorId,
      action: log.action,
      resource_type: log.resourceType,
      resource_id: log.resourceId,
      detail_json: log.detailJson,
      ip: log.ip,
      user_agent: log.userAgent,
      result: log.result,
      created_at: log.createdAt,
    });
  }

  findById(id: string): AuditLog | null {
    const row = this.findOne<AuditLogRow>('id = ?', [id]);
    return row ? toEntity(row) : null;
  }

  query(filter: AuditFilter, page: Page): PageResult<AuditLog> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (filter.actorId) {
      conditions.push('actor_id = ?');
      params.push(filter.actorId);
    }
    if (filter.action) {
      conditions.push('action = ?');
      params.push(filter.action);
    }
    if (filter.resourceType) {
      conditions.push('resource_type = ?');
      params.push(filter.resourceType);
    }
    if (filter.result) {
      conditions.push('result = ?');
      params.push(filter.result);
    }
    if (filter.startTime) {
      conditions.push('created_at >= ?');
      params.push(filter.startTime);
    }
    if (filter.endTime) {
      conditions.push('created_at <= ?');
      params.push(filter.endTime);
    }
    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const total = this.count(where, params);
    const p = Paginator.normalize(page.page, page.pageSize);
    const offset = (p.page - 1) * p.pageSize;
    const rows = this.conn
      .prepare(`SELECT * FROM audit_logs ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
      .all(...params, p.pageSize, offset) as AuditLogRow[];
    return Paginator.wrap(rows.map(toEntity), total, p);
  }

  deleteOlderThan(iso: string): number {
    const result = this.conn.prepare(`DELETE FROM audit_logs WHERE created_at < ?`).run(iso);
    return result.changes;
  }
}
