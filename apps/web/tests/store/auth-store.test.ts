import { useAuthStore } from '../src/store/auth-store';

describe('auth store', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, username: null });
  });

  it('初始未登录', () => {
    expect(useAuthStore.getState().token).toBeNull();
  });

  it('logout 清空状态', () => {
    useAuthStore.setState({ token: 't', username: 'admin' });
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().token).toBeNull();
  });
});
