import { useEffect } from 'react';
import { useLogsStore } from '../store/logs-store';
import type { LogFilter } from '../types';

export function useLogs(filter?: LogFilter & { page?: number; pageSize?: number }) {
  const logs = useLogsStore((s) => s.logs);
  const total = useLogsStore((s) => s.total);
  const loading = useLogsStore((s) => s.loading);
  const detail = useLogsStore((s) => s.detail);
  const fetch = useLogsStore((s) => s.fetch);
  const fetchDetail = useLogsStore((s) => s.fetchDetail);

  useEffect(() => {
    void fetch(filter);
  }, [JSON.stringify(filter)]);

  return { logs, total, loading, detail, fetch, fetchDetail };
}
