import { create } from 'zustand';
import type { ApiKey } from '../types';
import { keysApi } from '../api-client/keys-api';

interface KeysStore {
  keys: ApiKey[];
  total: number;
  loading: boolean;
  fetch: (params?: Record<string, unknown>) => Promise<void>;
  revoke: (id: string) => Promise<void>;
}

export const useKeysStore = create<KeysStore>((set) => ({
  keys: [],
  total: 0,
  loading: false,
  fetch: async (params = {}) => {
    set({ loading: true });
    try {
      const result = await keysApi.list(params);
      set({ keys: result.items, total: result.total });
    } finally {
      set({ loading: false });
    }
  },
  revoke: async (id) => {
    await keysApi.revoke(id);
  },
}));
