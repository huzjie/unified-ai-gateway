import { z } from 'zod';

/**
 * Zod 校验（服务配置）
 */
export const configSchema = z.object({
  server: z.object({ port: z.number().int().positive(), host: z.string() }),
  storage: z.object({ type: z.enum(['sqlite', 'memory']), databasePath: z.string() }),
  admin: z.object({ username: z.string().min(1), password: z.string().min(1) }),
  jwtSecret: z.string().min(16),
  providerKeyEncryptionKey: z.string().min(16),
  rateLimit: z.object({
    globalQps: z.number().positive(),
    globalBurst: z.number().positive().optional(),
    globalConcurrency: z.number().positive(),
    algorithm: z.enum(['token-bucket', 'fixed-window', 'sliding-window']).optional(),
    windowMs: z.number().positive().optional(),
  }),
  circuitBreaker: z.object({
    failureThreshold: z.number().min(0).max(1),
    minRequests: z.number().int().positive(),
    openMs: z.number().int().positive(),
    halfOpenRatio: z.number().min(0).max(1).optional(),
  }),
  providers: z.array(z.unknown()).optional(),
  aliases: z.record(z.array(z.string())).optional(),
  defaultTimeoutMs: z.number().int().positive(),
  defaultMaxRetries: z.number().int().min(0),
  webOrigin: z.string(),
  redisUrl: z.string().nullable(),
  mockProviderEnabled: z.boolean(),
  logRetentionDays: z.number().int().positive(),
  logLevel: z.string(),
});
