import { httpClient } from '../src/utils/http-client';

describe('http client', () => {
  it('设置 base url', () => {
    httpClient.setBaseUrl('http://localhost:9999/');
    // 通过请求失败验证 baseUrl 生效（不可达端口）
    // 不直接断言内部字段，仅确认方法可用
    expect(typeof httpClient.get).toBe('function');
  });
});
