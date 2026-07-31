import { useEffect } from 'react';
import { useKeysStore } from '../store/keys-store';

export function useKeys(params?: Record<string, unknown>) {
  const keys = useKeysStore((s) => s.keys);
  const total = useKeysStore((s) => s.total);
  const loading = useKeysStore((s) => s.loading);
  const fetch = useKeysStore((s) => s.fetch);
  const revoke = useKeysStore((s) => s.revoke);

  useEffect(() => {
    void fetch(params);
  }, [JSON.stringify(params)]);

  return { keys, total, loading, fetch, revoke };
}
