/**
 * 默认值常量
 */
export const DEFAULTS = {
  gateway: {
    server: { port: 8787, host: '0.0.0.0' },
    storage: { type: 'sqlite', databasePath: './data/gateway.db' },
    admin: { username: 'admin', password: 'change-me' },
    jwtSecret: 'please-change-me-to-a-long-random-string',
    providerKeyEncryptionKey: '0123456789abcdef0123456789abcdef',
    rateLimit: {
      globalQps: 1000,
      globalBurst: 2000,
      globalConcurrency: 200,
      algorithm: 'token-bucket',
      windowMs: 1000,
    },
    circuitBreaker: {
      failureThreshold: 0.5,
      minRequests: 10,
      openMs: 30000,
      halfOpenRatio: 0.5,
    },
    providers: [],
    aliases: {},
    defaultTimeoutMs: 30000,
    defaultMaxRetries: 2,
    webOrigin: 'http://localhost:5173',
    redisUrl: null,
    mockProviderEnabled: true,
    logRetentionDays: 30,
    logLevel: 'info',
  },
  rateLimit: {
    qps: 1000,
    burst: 2000,
    concurrency: 200,
  },
  circuitBreaker: {
    failureThreshold: 0.5,
    minRequests: 10,
    openMs: 30000,
    halfOpenRatio: 0.5,
  },
} as const;
