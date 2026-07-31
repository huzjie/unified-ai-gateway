/**
 * 服务环境变量解析
 */
export interface ServiceEnv {
  port: number;
  host: string;
  databasePath: string;
  logLevel: string;
  adminUsername: string;
  adminPassword: string;
  jwtSecret: string;
  providerKeyEncryptionKey: string;
  globalQps: number;
  globalConcurrency: number;
  defaultTimeoutMs: number;
  defaultMaxRetries: number;
  breakerFailureThreshold: number;
  breakerMinRequests: number;
  breakerOpenMs: number;
  webOrigin: string;
  redisUrl: string | null;
  mockProviderEnabled: boolean;
  logRetentionDays: number;
}

export function loadEnv(env: Record<string, string | undefined> = process.env): ServiceEnv {
  const num = (key: string, fallback: number): number => {
    const raw = env[key];
    if (raw === undefined || raw === '') return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };
  const str = (key: string, fallback: string): string => env[key] || fallback;
  const bool = (key: string, fallback: boolean): boolean => {
    const raw = env[key];
    if (raw === undefined || raw === '') return fallback;
    return raw === 'true' || raw === '1';
  };

  return {
    port: num('UAG_PORT', 8787),
    host: str('UAG_HOST', '0.0.0.0'),
    databasePath: str('UAG_DATABASE_PATH', './data/gateway.db'),
    logLevel: str('UAG_LOG_LEVEL', 'info'),
    adminUsername: str('UAG_ADMIN_USERNAME', 'admin'),
    adminPassword: str('UAG_ADMIN_PASSWORD', 'change-me'),
    jwtSecret: str('UAG_JWT_SECRET', ''),
    providerKeyEncryptionKey: str('UAG_PROVIDER_KEY_ENCRYPTION_KEY', ''),
    globalQps: num('UAG_GLOBAL_QPS', 1000),
    globalConcurrency: num('UAG_GLOBAL_CONCURRENCY', 200),
    defaultTimeoutMs: num('UAG_DEFAULT_TIMEOUT_MS', 30000),
    defaultMaxRetries: num('UAG_DEFAULT_MAX_RETRIES', 2),
    breakerFailureThreshold: num('UAG_CIRCUIT_BREAKER_FAILURE_THRESHOLD', 0.5),
    breakerMinRequests: num('UAG_CIRCUIT_BREAKER_MIN_REQUESTS', 10),
    breakerOpenMs: num('UAG_CIRCUIT_BREAKER_OPEN_MS', 30000),
    webOrigin: str('UAG_WEB_ORIGIN', 'http://localhost:5173'),
    redisUrl: env['UAG_REDIS_URL'] || null,
    mockProviderEnabled: bool('UAG_MOCK_PROVIDER_ENABLED', true),
    logRetentionDays: num('UAG_LOG_RETENTION_DAYS', 30),
  };
}
