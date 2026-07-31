import { RuntimeRegistry } from '../../src/services/runtime-registry';
import type { GatewayConfig } from '@uag/types';
import { KeyHasher, KeyGenerator } from '@uag/storage';

/**
 * 测试数据工厂
 */
export function makeTestConfig(): GatewayConfig {
  return {
    server: { port: 8787, host: '127.0.0.1' },
    storage: { type: 'sqlite', databasePath: ':memory:' },
    admin: { username: 'admin', password: 'test-password-123' },
    jwtSecret: 'test-jwt-secret-0123456789',
    providerKeyEncryptionKey: '0123456789abcdef0123456789abcdef',
    rateLimit: { globalQps: 1000, globalBurst: 2000, globalConcurrency: 200, algorithm: 'token-bucket', windowMs: 1000 },
    circuitBreaker: { failureThreshold: 0.5, minRequests: 10, openMs: 30000, halfOpenRatio: 0.5 },
    providers: [],
    aliases: {},
    defaultTimeoutMs: 30000,
    defaultMaxRetries: 0,
    webOrigin: 'http://localhost:5173',
    redisUrl: null,
    mockProviderEnabled: true,
    logRetentionDays: 30,
    logLevel: 'silent',
  };
}

/** 创建测试运行时（含 mock provider 与演示 Key） */
export async function makeTestRuntime(): Promise<RuntimeRegistry> {
  const runtime = new RuntimeRegistry(makeTestConfig());
  // 注册 mock provider
  await runtime.registerProviderAdapter({
    id: 'prov-mock',
    name: 'mock',
    type: 'mock',
    baseUrl: 'mock://local',
    encryptedApiKey: null,
    models: ['mock-all', 'mock-chat'],
    timeoutMs: 5000,
    maxRetries: 0,
  });
  // mock provider 同时落库（管理面列表可见）
  runtime.repos.provider.create({
    name: 'mock',
    type: 'mock',
    baseUrl: 'mock://local',
    encryptedApiKey: null,
    models: ['mock-all', 'mock-chat'],
    enabled: 'enabled',
  });
  // 默认路由规则
  runtime.repos.routeRule.create({
    name: 'default',
    priority: 100,
    matchModel: null,
    matchTenant: null,
    strategy: 'priority',
    targets: ['mock'],
    fallbackTargets: [],
    enabled: true,
  });
  runtime.reloadRouteRules();
  // 演示 Key
  const { plain, keyPrefix } = KeyGenerator.generate('test');
  const { salt, hash } = KeyHasher.hash(plain);
  runtime.repos.apiKey.create({
    name: 'test-key', tenant: 'test', keyHash: KeyHasher.combine(salt, hash), salt, keyPrefix,
    modelWhitelist: [], qpsLimit: 1000, concurrencyLimit: 100,
  });
  runtime.keyHashIndex.set(plain, KeyHasher.combine(salt, hash));
  runtime.testPlainKey = plain as never;
  return runtime;
}
