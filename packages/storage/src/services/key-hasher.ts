import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Key 哈希（SHA-256 + salt，格式 salt:hash）
 * API Key 明文仅创建时返回一次；落库仅存不可逆哈希。
 */
export class KeyHasher {
  /** 生成 salt（32 位 hex） */
  static generateSalt(bytes = 16): string {
    return randomBytes(bytes).toString('hex');
  }

  /** 加盐哈希 */
  static hash(plain: string, salt?: string): { salt: string; hash: string } {
    const s = salt ?? KeyHasher.generateSalt();
    const hash = createHash('sha256').update(`${s}:${plain}`).digest('hex');
    return { salt: s, hash };
  }

  /** 组合存储格式 salt:hash */
  static combine(salt: string, hash: string): string {
    return `${salt}:${hash}`;
  }

  /** 校验 */
  static verify(plain: string, stored: string): boolean {
    const sep = stored.indexOf(':');
    if (sep <= 0) {
      return false;
    }
    const salt = stored.slice(0, sep);
    const expected = stored.slice(sep + 1);
    const actual = createHash('sha256').update(`${salt}:${plain}`).digest('hex');
    const bufA = Buffer.from(actual);
    const bufB = Buffer.from(expected);
    if (bufA.length !== bufB.length) {
      return false;
    }
    return timingSafeEqual(bufA, bufB);
  }
}
