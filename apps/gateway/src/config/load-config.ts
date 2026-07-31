import type { GatewayConfig } from '@uag/types';
import { loadEnv } from './env';
import { DEFAULT_CONFIG } from './default-config';
import { deepMerge } from '@uag/core';

/**
 * 加载总配置（env + config 文件）
 */
export function loadConfig(env: Record<string, string | undefined> = process.env): GatewayConfig {
  const serviceEnv = loadEnv(env);
  const config = deepMerge(
    DEFAULT_CONFIG as unknown as Record<string, unknown>,
    {
      server: { port: serviceEnv.port, host: serviceEnv.host },
      storage: { type: 'sqlite', databasePath: serviceEnv.databasePath },
      admin: { username: serviceEnv.adminUsername, password: serviceEnv.adminPassword },
      jwtSecret: serviceEnv.jwtSecret,
      providerKeyEncryptionKey: serviceEnv.providerKeyEncryptionKey,
      rateLimit: {
        globalQps: serviceEnv.globalQps,
        globalConcurrency: serviceEnv.globalConcurrency,
      },
      circuitBreaker: {
        failureThreshold: serviceEnv.breakerFailureThreshold,
        minRequests: serviceEnv.breakerMinRequests,
        openMs: serviceEnv.breakerOpenMs,
      },
      defaultTimeoutMs: serviceEnv.defaultTimeoutMs,
      defaultMaxRetries: serviceEnv.defaultMaxRetries,
      webOrigin: serviceEnv.webOrigin,
      redisUrl: serviceEnv.redisUrl,
      mockProviderEnabled: serviceEnv.mockProviderEnabled,
      logRetentionDays: serviceEnv.logRetentionDays,
      logLevel: serviceEnv.logLevel,
    } as unknown as Record<string, unknown>,
  );
  return config as unknown as GatewayConfig;
}
