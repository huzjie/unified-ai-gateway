import { create } from 'zustand';
import type { SystemSettings } from '../types';
import { settingsApi } from '../api-client/settings-api';

interface SettingsStore {
  settings: SystemSettings | null;
  loading: boolean;
  fetch: () => Promise<void>;
  update: (patch: Partial<SystemSettings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: null,
  loading: false,
  fetch: async () => {
    set({ loading: true });
    try {
      const settings = await settingsApi.get();
      set({ settings });
    } finally {
      set({ loading: false });
    }
  },
  update: async (patch) => {
    const settings = await settingsApi.update(patch);
    set({ settings });
  },
}));
