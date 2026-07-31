import { http } from './http';
import type { ApiResponse, PageResult } from '../types';

export interface AuditLog {
  id: string;
  actorType: string;
  actorId: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  detailJson: string | null;
  ip: string | null;
  userAgent: string | null;
  result: 'success' | 'failure';
  createdAt: string;
}

export const auditApi = {
  async query(params: { action?: string; resourceType?: string; result?: string; page?: number; pageSize?: number } = {}): Promise<PageResult<AuditLog>> {
    const res = await http.get<ApiResponse<PageResult<AuditLog>>>('/audit', { params });
    return res.data.data;
  },
};
