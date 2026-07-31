import { http } from './http';
import type { ApiResponse, LogFilter, PageResult, UsageLog } from '../types';

export const logsApi = {
  async query(filter: LogFilter & { page?: number; pageSize?: number } = {}): Promise<PageResult<UsageLog>> {
    const res = await http.get<ApiResponse<PageResult<UsageLog>>>('/logs', { params: filter });
    return res.data.data;
  },
  async get(id: string): Promise<UsageLog> {
    const res = await http.get<ApiResponse<UsageLog>>(`/logs/${id}`);
    return res.data.data;
  },
};
