import { http } from './http';
import type { ApiResponse, DashboardData } from '../types';

export const dashboardApi = {
  async get(days = 7): Promise<DashboardData> {
    const res = await http.get<ApiResponse<DashboardData>>('/dashboard', { params: { days } });
    return res.data.data;
  },
};
