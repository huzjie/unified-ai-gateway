import { z } from 'zod';
import { configSchema } from './config-schema';

/**
 * 配置校验器
 */
export class ConfigValidator {
  /** 校验并返回规范化配置 */
  validate(config: unknown): z.infer<typeof configSchema> {
    const result = configSchema.safeParse(config);
    if (!result.success) {
      throw new Error(`配置校验失败: ${result.error.issues.map((i) => i.path.join('.') + ': ' + i.message).join('; ')}`);
    }
    return result.data;
  }

  /** 启动前安全校验（未配置加密密钥/JWT 密钥时拒绝启动） */
  assertSafe(config: z.infer<typeof configSchema>): void {
    if (!config.providerKeyEncryptionKey || config.providerKeyEncryptionKey.length < 16) {
      throw new Error('UAG_PROVIDER_KEY_ENCRYPTION_KEY 未配置或过短（至少 16 字符），拒绝启动');
    }
    if (!config.jwtSecret || config.jwtSecret.length < 16) {
      throw new Error('UAG_JWT_SECRET 未配置或过短（至少 16 字符），拒绝启动');
    }
    if (!config.admin.password || config.admin.password === 'change-me') {
      throw new Error('UAG_ADMIN_PASSWORD 未修改，拒绝启动');
    }
  }
}
