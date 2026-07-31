import type { AuditFilter, AuditLog, Page, PageResult } from '@uag/types';

export interface IAuditLogRepository {
  insert(log: AuditLog): void;
  findById(id: string): AuditLog | null;
  query(filter: AuditFilter, page: Page): PageResult<AuditLog>;
  deleteOlderThan(iso: string): number;
}
