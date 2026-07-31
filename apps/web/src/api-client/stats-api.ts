import { http } from './http';
import type { ApiResponse, HourlyTrend, StatsAggregate } from '../types';

export const statsApi = {
  async aggregate(params: { dimension?: string; model?: string; provider?: string; startTime?: string; endTime?: string } = {}): Promise<{
    dimension: string;
    data: StatsAggregate[];
    hourly: HourlyTrend[];
  }> {
    const res = await http.get<ApiResponse<{ dimension: string; data: StatsAggregate[]; hourly: HourlyTrend[] }>>('/stats', { params });
    return res.data.data;
  },
};
