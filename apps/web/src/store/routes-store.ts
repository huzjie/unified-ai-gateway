import { create } from 'zustand';
import type { RouteRule } from '../types';
import { routesApi } from '../api-client/routes-api';

interface RoutesStore {
  routes: RouteRule[];
  total: number;
  loading: boolean;
  fetch: (params?: Record<string, unknown>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useRoutesStore = create<RoutesStore>((set) => ({
  routes: [],
  total: 0,
  loading: false,
  fetch: async (params = {}) => {
    set({ loading: true });
    try {
      const result = await routesApi.list(params);
      set({ routes: result.items, total: result.total });
    } finally {
      set({ loading: false });
    }
  },
  remove: async (id) => {
    await routesApi.remove(id);
  },
}));
