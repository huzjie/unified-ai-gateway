import { usePagination } from '../src/hooks/use-pagination';
import { renderHook, act } from '@testing-library/react';

describe('usePagination', () => {
  it('翻页与页大小', () => {
    const { result } = renderHook(() => usePagination());
    expect(result.current.page).toBe(1);
    act(() => result.current.changePage(3));
    expect(result.current.page).toBe(3);
    act(() => result.current.changePageSize(50));
    expect(result.current.pageSize).toBe(50);
    expect(result.current.page).toBe(1);
  });
});
