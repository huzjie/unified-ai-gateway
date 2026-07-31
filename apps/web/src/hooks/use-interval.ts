import { useEffect } from 'react';

/** 定时刷新 */
export function useInterval(callback: () => void, intervalMs: number | null): void {
  useEffect(() => {
    if (intervalMs === null) {
      return;
    }
    const timer = setInterval(callback, intervalMs);
    return () => clearInterval(timer);
  }, [callback, intervalMs]);
}
