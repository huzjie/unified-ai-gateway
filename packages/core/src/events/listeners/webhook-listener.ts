import type { GatewayEvent, GatewayEventType } from '@uag/types';
import type { EventHandler } from '../event-types';

/** Webhook 目标 */
export interface WebhookTarget {
  url: string;
  secret: string;
  events: GatewayEventType[];
  enabled: boolean;
}

/**
 * Webhook 推送监听（P2）
 * M1 提供骨架：按事件类型过滤并推送 JSON 载荷，签名 HMAC-SHA256。
 */
export class WebhookListener {
  readonly handler: EventHandler;

  private targets: WebhookTarget[] = [];

  constructor(targets: WebhookTarget[] = []) {
    this.targets = targets;
    this.handler = (event: GatewayEvent) => {
      const matching = this.targets.filter(
        (t) => t.enabled && t.events.includes(event.type),
      );
      if (matching.length === 0) {
        return;
      }
      const body = JSON.stringify(event);
      for (const target of matching) {
        this.deliver(target, body).catch(() => undefined);
      }
    };
  }

  /** 更新目标 */
  setTargets(targets: WebhookTarget[]): void {
    this.targets = targets;
  }

  private async deliver(target: WebhookTarget, body: string): Promise<void> {
    const signature = await this.sign(body, target.secret);
    await fetch(target.url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-uag-signature': `sha256=${signature}`,
      },
      body,
      signal: AbortSignal.timeout(5000),
    });
  }

  private async sign(body: string, secret: string): Promise<string> {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
    return Buffer.from(sig).toString('hex');
  }
}
