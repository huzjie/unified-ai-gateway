import type { RuntimeRegistry } from './runtime-registry';

/**
 * 告警通知（限流/熔断/配额）
 */
export class NotificationService {
  constructor(private readonly runtime: RuntimeRegistry) {}

  /** 限流告警 */
  async rateLimited(scope: string, retryAfterMs: number): Promise<void> {
    const settings = this.runtime.settings.get();
    if (settings.alertRateLimited && settings.webhookUrl) {
      await this.runtime.webhookService.notify(settings.webhookUrl, 'uag-secret', 'rate_limited', { scope, retryAfterMs });
    }
  }

  /** 熔断告警 */
  async circuitOpen(providerKey: string): Promise<void> {
    const settings = this.runtime.settings.get();
    if (settings.alertCircuitOpen && settings.webhookUrl) {
      await this.runtime.webhookService.notify(settings.webhookUrl, 'uag-secret', 'circuit_opened', { providerKey });
    }
  }

  /** 配额告警 */
  async quotaExceeded(tenant: string): Promise<void> {
    const settings = this.runtime.settings.get();
    if (settings.alertQuotaExceeded && settings.webhookUrl) {
      await this.runtime.webhookService.notify(settings.webhookUrl, 'uag-secret', 'quota_exceeded', { tenant });
    }
  }
}
