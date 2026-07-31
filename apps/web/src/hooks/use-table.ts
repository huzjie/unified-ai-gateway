import { useState, useCallback } from 'react';

export interface TableSortState {
  field: string;
  order: 'asc' | 'desc';
}

/** 表格排序状态 */
export function useTable<T>(initialSort?: TableSortState) {
  const [sort, setSort] = useState<TableSortState | null>(initialSort ?? null);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSort = useCallback((field: string) => {
    setSort((prev) => {
      if (prev?.field === field) {
        return { field, order: prev.order === 'asc' ? 'desc' : 'asc' };
      }
      return { field, order: 'asc' };
    });
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const clearSelection = useCallback(() => setSelected([]), []);

  return { sort, selected, toggleSort, toggleSelect, clearSelection };
}
