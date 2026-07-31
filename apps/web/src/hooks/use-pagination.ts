import { useState, useCallback } from 'react';

/** 分页状态 */
export function usePagination(initialPage = 1, initialPageSize = 20) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const changePage = useCallback((p: number) => setPage(p), []);
  const changePageSize = useCallback((ps: number) => {
    setPageSize(ps);
    setPage(1);
  }, []);

  return { page, pageSize, changePage, changePageSize, params: { page, pageSize } };
}
