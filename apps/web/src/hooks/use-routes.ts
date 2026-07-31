import { useEffect } from 'react';
import { useRoutesStore } from '../store/routes-store';

export function useRoutes(params?: Record<string, unknown>) {
  const routes = useRoutesStore((s) => s.routes);
  const total = useRoutesStore((s) => s.total);
  const loading = useRoutesStore((s) => s.loading);
  const fetch = useRoutesStore((s) => s.fetch);
  const remove = useRoutesStore((s) => s.remove);

  useEffect(() => {
    void fetch(params);
  }, [JSON.stringify(params)]);

  return { routes, total, loading, fetch, remove };
}
