import { useDebounce } from '../src/hooks/use-debounce';
import { renderHook, act } from '@testing-library/react';

describe('useDebounce', () => {
  it('防抖更新', async () => {
    let value = 'a';
    const { result, rerender } = renderHook(() => useDebounce(value, 50));
    expect(result.current).toBe('a');
    value = 'b';
    rerender();
    expect(result.current).toBe('a');
    await act(async () => {
      await new Promise((r) => setTimeout(r, 80));
    });
    expect(result.current).toBe('b');
  });
});
