import { useEffect } from 'react';
import { useProvidersStore } from '../store/providers-store';

export function useProviders(params?: Record<string, unknown>) {
  const providers = useProvidersStore((s) => s.providers);
  const total = useProvidersStore((s) => s.total);
  const loading = useProvidersStore((s) => s.loading);
  const fetch = useProvidersStore((s) => s.fetch);
  const remove = useProvidersStore((s) => s.remove);

  useEffect(() => {
    void fetch(params);
  }, [JSON.stringify(params)]);

  return { providers, total, loading, fetch, remove };
}
