import { useEffect, useState } from 'react';

/**
 * SSE 连接（日志/指标实时刷新）
 */
export function useSse<T>(url: string, enabled = true): { data: T | null; connected: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    let closed = false;
    const source = new EventSource(url);
    source.onopen = () => setConnected(true);
    source.onmessage = (event) => {
      try {
        setData(JSON.parse(event.data) as T);
      } catch {
        // ignore
      }
    };
    source.onerror = () => setConnected(false);
    return () => {
      closed = true;
      source.close();
    };
  }, [url, enabled]);

  return { data, connected };
}
