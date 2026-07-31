import { loadEnv } from '../src/config/env';
import { loadConfig } from '../src/config/load-config';
import { ConfigValidator } from '../src/config/config-validator';

describe('config env', () => {
  it('loadEnv 默认值', () => {
    const env = loadEnv({});
    expect(env.port).toBe(8787);
    expect(env.adminUsername).toBe('admin');
    expect(env.mockProviderEnabled).toBe(true);
  });

  it('loadConfig 组装', () => {
    const config = loadConfig({ UAG_PORT: '9999', UAG_GLOBAL_QPS: '200' });
    expect(config.server.port).toBe(9999);
    expect(config.rateLimit.globalQps).toBe(200);
  });
});

describe('ConfigValidator', () => {
  const validator = new ConfigValidator();
  const base = {
    server: { port: 8787, host: '0.0.0.0' },
    storage: { type: 'sqlite', databasePath: './data/db' },
    admin: { username: 'admin', password: 'test-password-123' },
    jwtSecret: 'a'.repeat(16),
    providerKeyEncryptionKey: 'b'.repeat(16),
    rateLimit: { globalQps: 1000, globalConcurrency: 200 },
    circuitBreaker: { failureThreshold: 0.5, minRequests: 10, openMs: 30000 },
    defaultTimeoutMs: 30000,
    defaultMaxRetries: 2,
    webOrigin: 'http://localhost:5173',
    redisUrl: null,
    mockProviderEnabled: true,
    logRetentionDays: 30,
    logLevel: 'info',
  };

  it('校验通过', () => {
    expect(validator.validate(base)).toBeDefined();
  });

  it('安全校验拒绝未修改密码', () => {
    expect(() => validator.assertSafe({ ...base, admin: { username: 'admin', password: 'change-me' } })).toThrow();
  });
});
