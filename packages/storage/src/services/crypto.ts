import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

/**
 * Provider Key 加密（AES-256-GCM）
 * 密钥来自 UAG_PROVIDER_KEY_ENCRYPTION_KEY（32 字节）。
 */
export class CryptoService {
  private readonly key: Buffer;

  constructor(key: string) {
    if (!key || key.length < 16) {
      throw new Error('UAG_PROVIDER_KEY_ENCRYPTION_KEY 未配置或过短（至少 16 字符）');
    }
    // 使用 SHA-256 派生 32 字节密钥
    this.key = require('node:crypto').createHash('sha256').update(key).digest();
  }

  /** 加密 → base64(iv:tag:ciphertext) */
  encrypt(plain: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return [iv.toString('base64'), tag.toString('base64'), encrypted.toString('base64')].join(':');
  }

  /** 解密 */
  decrypt(payload: string): string {
    const parts = payload.split(':');
    if (parts.length !== 3) {
      throw new Error('加密载荷格式无效');
    }
    const [ivB64, tagB64, dataB64] = parts;
    const decipher = createDecipheriv('aes-256-gcm', this.key, Buffer.from(ivB64, 'base64'));
    decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(dataB64, 'base64')),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  }

  /** 掩码展示（sk-***abc） */
  static mask(plain: string): string {
    if (plain.length <= 8) {
      return '***';
    }
    return `${plain.slice(0, 3)}***${plain.slice(-3)}`;
  }
}
