import { randomBytes } from 'node:crypto';

/**
 * Key 明文生成器
 * 格式：sk-live-<16位随机hex>（前缀便于识别环境）
 */
export class KeyGenerator {
  /** 生成明文 Key */
  static generate(prefix = 'live'): { plain: string; keyPrefix: string } {
    const rand = randomBytes(16).toString('hex');
    const plain = `sk-${prefix}-${rand}`;
    // key_prefix 展示用：sk-live-前10位
    const keyPrefix = plain.slice(0, Math.min(14, plain.length));
    return { plain, keyPrefix };
  }

  /** 从明文提取展示前缀 */
  static extractPrefix(plain: string, length = 14): string {
    return plain.slice(0, Math.min(length, plain.length));
  }
}
