import { http } from './http';
import type { ApiResponse, PageResult, Provider, ProviderCreateInput, ProviderTestResult } from '../types';

export const providersApi = {
  async list(params: { type?: string; search?: string; page?: number; pageSize?: number } = {}): Promise<PageResult<Provider>> {
    const res = await http.get<ApiResponse<PageResult<Provider>>>('/providers', { params });
    return res.data.data;
  },
  async create(input: ProviderCreateInput): Promise<Provider> {
    const res = await http.post<ApiResponse<Provider>>('/providers', input);
    return res.data.data;
  },
  async update(id: string, patch: Partial<ProviderCreateInput>): Promise<Provider> {
    const res = await http.put<ApiResponse<Provider>>(`/providers/${id}`, patch);
    return res.data.data;
  },
  async remove(id: string): Promise<void> {
    await http.delete(`/providers/${id}`);
  },
  async test(id: string): Promise<ProviderTestResult> {
    const res = await http.post<ApiResponse<ProviderTestResult>>(`/providers/${id}/test`, {});
    return res.data.data;
  },
};
