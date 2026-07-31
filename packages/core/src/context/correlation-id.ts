import { randomBytes } from 'node:crypto';

/**
 * 关联 ID 生成
 */
export function generateCorrelationId(): string {
  return `cid-${Date.now().toString(36)}-${randomBytes(6).toString('hex')}`;
}

export function generateRequestId(): string {
  return `uag-${Date.now().toString(36)}-${randomBytes(4).toString('hex')}`;
}
