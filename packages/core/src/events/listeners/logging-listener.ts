import type { GatewayEvent } from '@uag/types';
import type { EventHandler } from '../event-types';
import type { Logger } from '../../utils/logger';

/**
 * 日志监听：请求日志落库
 * 依赖注入 UsageLogSink（由 storage 层实现）
 */
export interface UsageLogSink {
  insert(log: import('@uag/types').UsageLog): Promise<void>;
  upsertDailyStats(log: import('@uag/types').UsageLog): Promise<void>;
}

export class LoggingListener {
  readonly handler: EventHandler;

  constructor(
    private readonly sink: UsageLogSink,
    private readonly logger: Logger,
  ) {
    this.handler = (event: GatewayEvent) => {
      if (event.type === 'usage_recorded') {
        const payload = event.payload as { log: import('@uag/types').UsageLog };
        this.sink
          .insert(payload.log)
          .then(() => this.sink.upsertDailyStats(payload.log))
          .catch((err: unknown) => {
            this.logger.error({ err }, 'failed to persist usage log');
          });
      }
    };
  }
}
