import { http } from './http';
import type { ApiResponse, PageResult, RouteRule, RouteRuleCreateInput } from '../types';

export const routesApi = {
  async list(params: { search?: string; page?: number; pageSize?: number } = {}): Promise<PageResult<RouteRule>> {
    const res = await http.get<ApiResponse<PageResult<RouteRule>>>('/routes', { params });
    return res.data.data;
  },
  async create(input: RouteRuleCreateInput): Promise<RouteRule> {
    const res = await http.post<ApiResponse<RouteRule>>('/routes', input);
    return res.data.data;
  },
  async update(id: string, patch: Partial<RouteRuleCreateInput>): Promise<RouteRule> {
    const res = await http.put<ApiResponse<RouteRule>>(`/routes/${id}`, patch);
    return res.data.data;
  },
  async remove(id: string): Promise<void> {
    await http.delete(`/routes/${id}`);
  },
  async dryRun(model: string, tenant: string): Promise<unknown> {
    const res = await http.post<ApiResponse<unknown>>('/routes/dry-run', { model, tenant });
    return res.data.data;
  },
};
