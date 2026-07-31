import { randomBytes, randomUUID } from 'node:crypto';

/** UUID v4 */
export function uuid(): string {
  return randomUUID();
}

/** 短 ID（n 位 hex） */
export function shortId(length = 8): string {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

/** 请求关联 ID：uag-<timestamp>-<rand> */
export function generateRequestId(): string {
  return `uag-${Date.now().toString(36)}-${shortId(8)}`;
}

/** 关联 ID（贯穿请求） */
export function generateCorrelationId(): string {
  return `cid-${Date.now().toString(36)}-${shortId(10)}`;
}

let snowflakeSeq = 0;
let snowflakeLast = 0;

/** 简易雪花 ID（进程内唯一） */
export function snowflakeId(): string {
  const now = Date.now();
  if (now === snowflakeLast) {
    snowflakeSeq = (snowflakeSeq + 1) & 0xfff;
  } else {
    snowflakeSeq = 0;
    snowflakeLast = now;
  }
  const tsPart = BigInt(now) << 12n;
  const seqPart = BigInt(snowflakeSeq);
  return (tsPart | seqPart).toString();
}
