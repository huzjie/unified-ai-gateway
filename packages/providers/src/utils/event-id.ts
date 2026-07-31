import { randomBytes } from 'node:crypto';

/**
 * SSE event id 生成
 */
export function generateSseEventId(): string {
  return `evt_${Date.now().toString(36)}_${randomBytes(4).toString('hex')}`;
}
