import { useEffect } from 'react';
import { useSettingsStore } from '../store/settings-store';

export function useSettings() {
  const settings = useSettingsStore((s) => s.settings);
  const loading = useSettingsStore((s) => s.loading);
  const fetch = useSettingsStore((s) => s.fetch);
  const update = useSettingsStore((s) => s.update);

  useEffect(() => {
    if (!settings) {
      void fetch();
    }
  }, []);

  return { settings, loading, fetch, update };
}
