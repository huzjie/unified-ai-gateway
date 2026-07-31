import type { AuditFilter, AuditLog, Page, PageResult } from '@uag/types';
import type { RuntimeRegistry } from './runtime-registry';

/**
 * 审计记录/查询
 */
export class AuditService {
  constructor(private readonly runtime: RuntimeRegistry) {}

  /** 记录审计日志（事件总线 → listener 落库 + 同步落库） */
  record(
    resourceType: string,
    action: string,
    resourceId: string | null,
    result: 'success' | 'failure',
    detail?: Record<string, unknown>,
    actorType: 'admin' | 'system' = 'admin',
  ): void {
    const log: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      actorType,
      actorId: 'admin',
      action,
      resourceType,
      resourceId,
      detailJson: detail ? JSON.stringify(detail) : null,
      ip: null,
      userAgent: null,
      result,
      createdAt: new Date().toISOString(),
    };
    this.runtime.eventBus.publish('audit_logged', { log });
    this.runtime.repos.auditLog.insert(log);
  }

  query(filter: AuditFilter, page: Page): PageResult<AuditLog> {
    return this.runtime.repos.auditLog.query(filter, page);
  }
}
