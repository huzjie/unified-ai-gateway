import { useEffect } from 'react';
import { useStatsStore } from '../store/stats-store';

export function useStats(params?: Record<string, unknown>) {
  const data = useStatsStore((s) => s.data);
  const hourly = useStatsStore((s) => s.hourly);
  const dimension = useStatsStore((s) => s.dimension);
  const loading = useStatsStore((s) => s.loading);
  const fetch = useStatsStore((s) => s.fetch);
  const setDimension = useStatsStore((s) => s.setDimension);

  useEffect(() => {
    void fetch(params);
  }, [JSON.stringify(params)]);

  return { data, hourly, dimension, loading, fetch, setDimension };
}
