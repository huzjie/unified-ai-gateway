import { auth } from '../src/utils/auth';

describe('auth utils', () => {
  afterEach(() => {
    auth.clearToken();
  });

  it('保存与读取 token', () => {
    auth.saveToken('jwt-token');
    expect(auth.getToken()).toBe('jwt-token');
  });

  it('清空 token', () => {
    auth.saveToken('x');
    auth.clearToken();
    expect(auth.getToken()).toBeNull();
  });
});
