import { http } from './http';
import type { ApiKey, ApiKeyCreateInput, ApiKeyCreateResult, ApiResponse, PageResult } from '../types';

export const keysApi = {
  async list(params: { tenant?: string; status?: string; search?: string; page?: number; pageSize?: number } = {}): Promise<PageResult<ApiKey>> {
    const res = await http.get<ApiResponse<PageResult<ApiKey>>>('/keys', { params });
    return res.data.data;
  },
  async create(input: ApiKeyCreateInput): Promise<ApiKeyCreateResult> {
    const res = await http.post<ApiResponse<ApiKeyCreateResult>>('/keys', input);
    return res.data.data;
  },
  async update(id: string, patch: Partial<ApiKeyCreateInput>): Promise<ApiKey> {
    const res = await http.put<ApiResponse<ApiKey>>(`/keys/${id}`, patch);
    return res.data.data;
  },
  async revoke(id: string): Promise<void> {
    await http.delete(`/keys/${id}`);
  },
};
