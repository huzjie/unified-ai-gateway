import { gatewayConfigSchema, providerConfigSchema } from '../../src/config/schema';

describe('config schema', () => {
  it('网关配置校验通过', () => {
    const result = gatewayConfigSchema.safeParse({
      server: { port: 8787, host: '0.0.0.0' },
      storage: { databasePath: './data/db' },
      admin: { username: 'admin', password: 'secret' },
      jwtSecret: 'a'.repeat(16),
      providerKeyEncryptionKey: 'b'.repeat(16),
      rateLimit: { globalQps: 1000, globalConcurrency: 200 },
      circuitBreaker: { failureThreshold: 0.5, minRequests: 10, openMs: 30000 },
    });
    expect(result.success).toBe(true);
  });

  it('无效配置校验失败', () => {
    const result = gatewayConfigSchema.safeParse({
      server: { port: -1, host: '' },
    });
    expect(result.success).toBe(false);
  });

  it('Provider 配置校验', () => {
    expect(providerConfigSchema.safeParse({ name: 'm', type: 'moonshot', baseUrl: 'https://x' }).success).toBe(true);
    expect(providerConfigSchema.safeParse({ name: '', type: 'bad' }).success).toBe(false);
  });
});
