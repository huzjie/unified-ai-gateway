import { useState, useCallback } from 'react';

/** 弹窗状态管理 */
export function useModal<T = unknown>(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);
  const [data, setData] = useState<T | null>(null);

  const openModal = useCallback((d?: T) => {
    if (d !== undefined) setData(d);
    setOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setOpen(false);
    setData(null);
  }, []);

  return { open, data, openModal, closeModal, setOpen };
}
