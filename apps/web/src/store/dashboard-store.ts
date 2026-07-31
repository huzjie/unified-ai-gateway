import { create } from 'zustand';
import type { DashboardData } from '../types';
import { dashboardApi } from '../api-client/dashboard-api';

interface DashboardStore {
  data: DashboardData | null;
  loading: boolean;
  fetch: (days?: number) => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  data: null,
  loading: false,
  fetch: async (days = 7) => {
    set({ loading: true });
    try {
      const data = await dashboardApi.get(days);
      set({ data });
    } finally {
      set({ loading: false });
    }
  },
}));
