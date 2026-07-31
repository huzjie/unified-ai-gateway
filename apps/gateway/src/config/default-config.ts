/**
 * 默认值
 */
export const DEFAULT_CONFIG = {
  server: { port: 8787, host: '0.0.0.0' },
  storage: { type: 'sqlite', databasePath: './data/gateway.db' },
  admin: { username: 'admin', password: 'change-me' },
  jwtSecret: '',
  providerKeyEncryptionKey: '',
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
} as const;
