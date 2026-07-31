import { useEffect } from 'react';
import { useDashboardStore } from '../store/dashboard-store';

export function useDashboard(days = 7) {
  const data = useDashboardStore((s) => s.data);
  const loading = useDashboardStore((s) => s.loading);
  const fetch = useDashboardStore((s) => s.fetch);

  useEffect(() => {
    void fetch(days);
  }, [days]);

  return { data, loading, fetch };
}
