import { create } from 'zustand';
import type { LogFilter, UsageLog } from '../types';
import { logsApi } from '../api-client/logs-api';

interface LogsStore {
  logs: UsageLog[];
  total: number;
  loading: boolean;
  detail: UsageLog | null;
  fetch: (filter?: LogFilter & { page?: number; pageSize?: number }) => Promise<void>;
  fetchDetail: (id: string) => Promise<void>;
}

export const useLogsStore = create<LogsStore>((set) => ({
  logs: [],
  total: 0,
  loading: false,
  detail: null,
  fetch: async (filter = {}) => {
    set({ loading: true });
    try {
      const result = await logsApi.query(filter);
      set({ logs: result.items, total: result.total });
    } finally {
      set({ loading: false });
    }
  },
  fetchDetail: async (id) => {
    const detail = await logsApi.get(id);
    set({ detail });
  },
}));
