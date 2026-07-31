import type { ISODateTime } from '../common/timestamp';

/** 审计日志实体 */
export interface AuditLog {
  id: string;
  actorType: 'admin' | 'system' | 'api_key';
  actorId: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  detailJson: string | null;
  ip: string | null;
  userAgent: string | null;
  result: 'success' | 'failure';
  createdAt: ISODateTime;
}

/** 审计查询过滤 */
export interface AuditFilter {
  actorId?: string;
  action?: string;
  resourceType?: string;
  result?: 'success' | 'failure';
  startTime?: ISODateTime;
  endTime?: ISODateTime;
}
