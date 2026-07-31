import { z } from 'zod';

/**
 * Zod schema（全量配置校验）
 */
export const providerConfigSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['openai', 'moonshot', 'deepseek', 'minimax', 'anthropic', 'ollama', 'mock']),
  baseUrl: z.string().url().or(z.string().min(1)),
  apiKey: z.string().optional(),
  models: z.array(z.string()).optional(),
  pricing: z.record(z.string(), z.object({ input: z.number(), output: z.number(), perRequest: z.number().optional() })).optional(),
  timeoutMs: z.number().int().positive().optional(),
  maxRetries: z.number().int().min(0).optional(),
  enabled: z.boolean().optional(),
});

export const routeRuleSchema = z.object({
  name: z.string().min(1),
  priority: z.number().int().optional(),
  matchModel: z.string().nullable().optional(),
  matchTenant: z.string().nullable().optional(),
  strategy: z.enum(['priority', 'failover', 'cost-first', 'random']).optional(),
  targets: z.array(z.string().min(1)).min(1),
  fallbackTargets: z.array(z.string()).optional(),
  breakerThreshold: z.number().min(0).max(1).optional(),
  enabled: z.boolean().optional(),
});

export const gatewayConfigSchema = z.object({
  server: z.object({ port: z.number().int().positive(), host: z.string() }),
  storage: z.object({ type: z.enum(['sqlite', 'memory']).optional(), databasePath: z.string() }),
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
  providers: z.array(providerConfigSchema).optional(),
  aliases: z.record(z.string(), z.array(z.string())).optional(),
  defaultTimeoutMs: z.number().int().positive().optional(),
  defaultMaxRetries: z.number().int().min(0).optional(),
  webOrigin: z.string().optional(),
  redisUrl: z.string().nullable().optional(),
  mockProviderEnabled: z.boolean().optional(),
  logRetentionDays: z.number().int().positive().optional(),
  logLevel: z.string().optional(),
});
