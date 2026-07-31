import { useToast } from '../src/hooks/use-toast';
import { useNotificationsStore } from '../src/store/notifications-store';
import { renderHook, act } from '@testing-library/react';

describe('useToast', () => {
  beforeEach(() => {
    useNotificationsStore.setState({ toasts: [] });
  });

  it('show 添加 toast', () => {
    const { result } = renderHook(() => useToast());
    act(() => result.current.success('保存成功'));
    expect(useNotificationsStore.getState().toasts.length).toBe(1);
    expect(useNotificationsStore.getState().toasts[0].type).toBe('success');
  });
});
