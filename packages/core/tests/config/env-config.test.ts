import { parseEnv } from '../../src/config/env-config';

describe('env-config', () => {
  it('默认值', () => {
    const env = parseEnv({});
    expect(env.server.port).toBe(8787);
    expect(env.admin.username).toBe('admin');
    expect(env.mockProviderEnabled).toBe(true);
  });

  it('解析 UAG_* 环境变量', () => {
    const env = parseEnv({
      UAG_PORT: '9000',
      UAG_ADMIN_USERNAME: 'root',
      UAG_GLOBAL_QPS: '500',
      UAG_MOCK_PROVIDER_ENABLED: 'false',
      UAG_REDIS_URL: 'redis://localhost:6379',
    });
    expect(env.server.port).toBe(9000);
    expect(env.admin.username).toBe('root');
    expect(env.rateLimit.globalQps).toBe(500);
    expect(env.mockProviderEnabled).toBe(false);
    expect(env.redisUrl).toBe('redis://localhost:6379');
  });

  it('无效数值回退默认', () => {
    const env = parseEnv({ UAG_PORT: 'abc' });
    expect(env.server.port).toBe(8787);
  });
});
