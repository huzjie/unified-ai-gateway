import type { ProviderConfigSchema } from './provider-config';
import type { RateLimitConfig } from './rate-limit-config';
import type { CircuitBreakerConfig } from './circuit-breaker-config';

/** 网关整体配置 */
export interface GatewayConfig {
  /** 服务监听 */
  server: {
    port: number;
    host: string;
  };
  /** 存储 */
  storage: {
    type: 'sqlite' | 'memory';
    databasePath: string;
  };
  /** 管理员 */
  admin: {
    username: string;
    password: string;
  };
  /** JWT 密钥 */
  jwtSecret: string;
  /** Provider Key 加密密钥 */
  providerKeyEncryptionKey: string;
  /** 限流配置 */
  rateLimit: RateLimitConfig;
  /** 熔断配置 */
  circuitBreaker: CircuitBreakerConfig;
  /** Provider 配置列表 */
  providers: ProviderConfigSchema[];
  /** 模型别名（虚拟模型 → 候选） */
  aliases: Record<string, string[]>;
  /** 默认超时（ms） */
  defaultTimeoutMs: number;
  /** 默认重试 */
  defaultMaxRetries: number;
  /** Web 控制台源 */
  webOrigin: string;
  /** Redis URL（可选） */
  redisUrl: string | null;
  /** 是否启用 mock provider */
  mockProviderEnabled: boolean;
  /** 日志保留天数 */
  logRetentionDays: number;
  /** 日志级别 */
  logLevel: string;
}
