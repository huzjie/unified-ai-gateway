/**
 * UAG_* 环境变量解析
 */
export interface EnvVars {
  [key: string]: string | undefined;
}

export interface ParsedEnv {
  server: { port: number; host: string };
  storage: { databasePath: string };
  admin: { username: string; password: string };
  jwtSecret: string;
  providerKeyEncryptionKey: string;
  rateLimit: {
    globalQps: number;
    globalConcurrency: number;
  };
  circuitBreaker: {
    failureThreshold: number;
    minRequests: number;
    openMs: number;
  };
  defaultTimeoutMs: number;
  defaultMaxRetries: number;
  webOrigin: string;
  redisUrl: string | null;
  mockProviderEnabled: boolean;
  logRetentionDays: number;
  logLevel: string;
}

/** 解析环境变量（UAG_ 前缀） */
export function parseEnv(env: EnvVars): ParsedEnv {
  const num = (key: string, fallback: number): number => {
    const raw = env[key];
    if (raw === undefined || raw === '') {
      return fallback;
    }
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };
  const str = (key: string, fallback: string): string => env[key] || fallback;
  const bool = (key: string, fallback: boolean): boolean => {
    const raw = env[key];
    if (raw === undefined || raw === '') {
      return fallback;
    }
    return raw === 'true' || raw === '1';
  };

  return {
    server: {
      port: num('UAG_PORT', 8787),
      host: str('UAG_HOST', '0.0.0.0'),
    },
    storage: {
      databasePath: str('UAG_DATABASE_PATH', './data/gateway.db'),
    },
    admin: {
      username: str('UAG_ADMIN_USERNAME', 'admin'),
      password: str('UAG_ADMIN_PASSWORD', 'change-me'),
    },
    jwtSecret: str('UAG_JWT_SECRET', ''),
    providerKeyEncryptionKey: str('UAG_PROVIDER_KEY_ENCRYPTION_KEY', ''),
    rateLimit: {
      globalQps: num('UAG_GLOBAL_QPS', 1000),
      globalConcurrency: num('UAG_GLOBAL_CONCURRENCY', 200),
    },
    circuitBreaker: {
      failureThreshold: num('UAG_CIRCUIT_BREAKER_FAILURE_THRESHOLD', 0.5),
      minRequests: num('UAG_CIRCUIT_BREAKER_MIN_REQUESTS', 10),
      openMs: num('UAG_CIRCUIT_BREAKER_OPEN_MS', 30000),
    },
    defaultTimeoutMs: num('UAG_DEFAULT_TIMEOUT_MS', 30000),
    defaultMaxRetries: num('UAG_DEFAULT_MAX_RETRIES', 2),
    webOrigin: str('UAG_WEB_ORIGIN', 'http://localhost:5173'),
    redisUrl: env['UAG_REDIS_URL'] || null,
    mockProviderEnabled: bool('UAG_MOCK_PROVIDER_ENABLED', true),
    logRetentionDays: num('UAG_LOG_RETENTION_DAYS', 30),
    logLevel: str('UAG_LOG_LEVEL', 'info'),
  };
}

/**
 * 仅解析显式设置的环境变量（未设置/空值不产生字段）。
 * 用于配置合并：保证优先级为 默认值 < 配置文件 < 仅显式设置的环境变量，
 * 避免未设置的环境变量以默认值覆盖配置文件。
 */
export function parseEnvExplicit(env: EnvVars): Partial<ParsedEnv> {
  const rawNum = (key: string): number | undefined => {
    const raw = env[key];
    if (raw === undefined || raw === '') {
      return undefined;
    }
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  };
  const rawStr = (key: string): string | undefined => {
    const raw = env[key];
    return raw === undefined || raw === '' ? undefined : raw;
  };
  const rawBool = (key: string): boolean | undefined => {
    const raw = env[key];
    if (raw === undefined || raw === '') {
      return undefined;
    }
    return raw === 'true' || raw === '1';
  };

  const result: Partial<ParsedEnv> = {};

  const server: Partial<ParsedEnv['server']> = {};
  const port = rawNum('UAG_PORT');
  const host = rawStr('UAG_HOST');
  if (port !== undefined) server.port = port;
  if (host !== undefined) server.host = host;
  if (Object.keys(server).length > 0) result.server = server as ParsedEnv['server'];

  const storage: Partial<ParsedEnv['storage']> = {};
  const databasePath = rawStr('UAG_DATABASE_PATH');
  if (databasePath !== undefined) storage.databasePath = databasePath;
  if (Object.keys(storage).length > 0) result.storage = storage as ParsedEnv['storage'];

  const admin: Partial<ParsedEnv['admin']> = {};
  const username = rawStr('UAG_ADMIN_USERNAME');
  const password = rawStr('UAG_ADMIN_PASSWORD');
  if (username !== undefined) admin.username = username;
  if (password !== undefined) admin.password = password;
  if (Object.keys(admin).length > 0) result.admin = admin as ParsedEnv['admin'];

  const jwtSecret = rawStr('UAG_JWT_SECRET');
  if (jwtSecret !== undefined) result.jwtSecret = jwtSecret;

  const providerKeyEncryptionKey = rawStr('UAG_PROVIDER_KEY_ENCRYPTION_KEY');
  if (providerKeyEncryptionKey !== undefined) result.providerKeyEncryptionKey = providerKeyEncryptionKey;

  const rateLimit: Partial<ParsedEnv['rateLimit']> = {};
  const globalQps = rawNum('UAG_GLOBAL_QPS');
  const globalConcurrency = rawNum('UAG_GLOBAL_CONCURRENCY');
  if (globalQps !== undefined) rateLimit.globalQps = globalQps;
  if (globalConcurrency !== undefined) rateLimit.globalConcurrency = globalConcurrency;
  if (Object.keys(rateLimit).length > 0) result.rateLimit = rateLimit as ParsedEnv['rateLimit'];

  const circuitBreaker: Partial<ParsedEnv['circuitBreaker']> = {};
  const failureThreshold = rawNum('UAG_CIRCUIT_BREAKER_FAILURE_THRESHOLD');
  const minRequests = rawNum('UAG_CIRCUIT_BREAKER_MIN_REQUESTS');
  const openMs = rawNum('UAG_CIRCUIT_BREAKER_OPEN_MS');
  if (failureThreshold !== undefined) circuitBreaker.failureThreshold = failureThreshold;
  if (minRequests !== undefined) circuitBreaker.minRequests = minRequests;
  if (openMs !== undefined) circuitBreaker.openMs = openMs;
  if (Object.keys(circuitBreaker).length > 0) result.circuitBreaker = circuitBreaker as ParsedEnv['circuitBreaker'];

  const defaultTimeoutMs = rawNum('UAG_DEFAULT_TIMEOUT_MS');
  if (defaultTimeoutMs !== undefined) result.defaultTimeoutMs = defaultTimeoutMs;

  const defaultMaxRetries = rawNum('UAG_DEFAULT_MAX_RETRIES');
  if (defaultMaxRetries !== undefined) result.defaultMaxRetries = defaultMaxRetries;

  const webOrigin = rawStr('UAG_WEB_ORIGIN');
  if (webOrigin !== undefined) result.webOrigin = webOrigin;

  const redisUrl = env['UAG_REDIS_URL'];
  if (redisUrl !== undefined && redisUrl !== '') {
    result.redisUrl = redisUrl;
  } else if (redisUrl !== undefined) {
    result.redisUrl = null;
  }

  const mockProviderEnabled = rawBool('UAG_MOCK_PROVIDER_ENABLED');
  if (mockProviderEnabled !== undefined) result.mockProviderEnabled = mockProviderEnabled;

  const logRetentionDays = rawNum('UAG_LOG_RETENTION_DAYS');
  if (logRetentionDays !== undefined) result.logRetentionDays = logRetentionDays;

  const logLevel = rawStr('UAG_LOG_LEVEL');
  if (logLevel !== undefined) result.logLevel = logLevel;

  return result;
}
