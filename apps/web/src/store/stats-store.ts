import { create } from 'zustand';
import type { HourlyTrend, StatsAggregate } from '../types';
import { statsApi } from '../api-client/stats-api';

interface StatsStore {
  data: StatsAggregate[];
  hourly: HourlyTrend[];
  dimension: string;
  loading: boolean;
  fetch: (params?: Record<string, unknown>) => Promise<void>;
  setDimension: (dimension: string) => void;
}

export const useStatsStore = create<StatsStore>((set) => ({
  data: [],
  hourly: [],
  dimension: 'model',
  loading: false,
  fetch: async (params = {}) => {
    set({ loading: true });
    try {
      const result = await statsApi.aggregate({ dimension: 'model', ...params });
      set({ data: result.data, hourly: result.hourly, dimension: result.dimension });
    } finally {
      set({ loading: false });
    }
  },
  setDimension: (dimension) => set({ dimension }),
}));
