import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/** SHA-256 hex 摘要 */
export function sha256Hex(input: string | Buffer): string {
  return createHash('sha256').update(input).digest('hex');
}

/** 生成随机 salt（32 位 hex） */
export function generateSalt(bytes = 16): string {
  return randomBytes(bytes).toString('hex');
}

/** 加盐哈希：格式 salt:hash */
export function hashWithSalt(value: string, salt?: string): { salt: string; hash: string } {
  const s = salt ?? generateSalt();
  const hash = sha256Hex(`${s}:${value}`);
  return { salt: s, hash };
}

/** 校验哈希（格式 salt:hash） */
export function verifyHash(value: string, stored: string): boolean {
  const sep = stored.indexOf(':');
  if (sep <= 0) {
    return false;
  }
  const salt = stored.slice(0, sep);
  const expected = stored.slice(sep + 1);
  const actual = sha256Hex(`${salt}:${value}`);
  return timingSafeEqualHex(actual, expected);
}

/** 常量时间比较（hex 字符串） */
export function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // 仍执行一次比较避免长度侧信道
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    timingSafeEqual(bufA, bufB);
    return false;
  }
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
