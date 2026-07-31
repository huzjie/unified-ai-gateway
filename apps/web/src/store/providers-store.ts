import { create } from 'zustand';
import type { Provider } from '../types';
import { providersApi } from '../api-client/providers-api';

interface ProvidersStore {
  providers: Provider[];
  total: number;
  loading: boolean;
  fetch: (params?: Record<string, unknown>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useProvidersStore = create<ProvidersStore>((set) => ({
  providers: [],
  total: 0,
  loading: false,
  fetch: async (params = {}) => {
    set({ loading: true });
    try {
      const result = await providersApi.list(params);
      set({ providers: result.items, total: result.total });
    } finally {
      set({ loading: false });
    }
  },
  remove: async (id) => {
    await providersApi.remove(id);
  },
}));
