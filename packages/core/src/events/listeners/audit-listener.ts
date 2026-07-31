import type { AuditLog, GatewayEvent } from '@uag/types';
import type { EventHandler } from '../event-types';

/** 审计日志落库接口 */
export interface AuditLogSink {
  insert(log: AuditLog): Promise<void>;
}

/**
 * 审计日志监听
 */
export class AuditListener {
  readonly handler: EventHandler;

  constructor(private readonly sink: AuditLogSink) {
    this.handler = (event: GatewayEvent) => {
      if (event.type === 'audit_logged') {
        const payload = event.payload as { log: AuditLog };
        this.sink.insert(payload.log).catch((err: unknown) => {
          // eslint-disable-next-line no-console
          console.error('[audit-listener] insert failed:', err);
        });
      }
    };
  }
}
