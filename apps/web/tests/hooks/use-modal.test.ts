import { useModal } from '../src/hooks/use-modal';
import { renderHook, act } from '@testing-library/react';

describe('useModal', () => {
  it('开关与数据', () => {
    const { result } = renderHook(() => useModal<string>());
    expect(result.current.open).toBe(false);
    act(() => result.current.openModal('data'));
    expect(result.current.open).toBe(true);
    expect(result.current.data).toBe('data');
    act(() => result.current.closeModal());
    expect(result.current.open).toBe(false);
    expect(result.current.data).toBeNull();
  });
});
