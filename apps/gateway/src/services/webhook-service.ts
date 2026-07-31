import type { RuntimeRegistry } from './runtime-registry';
import { createHmac } from 'node:crypto';

/**
 * Webhook 签名推送（P2）
 */
export class WebhookService {
  constructor(_runtime: RuntimeRegistry) {}

  /** 推送事件到 Webhook */
  async notify(url: string, secret: string, eventType: string, payload: unknown): Promise<boolean> {
    try {
      const body = JSON.stringify({ type: eventType, payload, ts: new Date().toISOString() });
      const signature = createHmac('sha256', secret).update(body).digest('hex');
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-uag-signature': `sha256=${signature}`,
        },
        body,
        signal: AbortSignal.timeout(5000),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
