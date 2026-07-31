import { createLogger, type Logger } from '@uag/core';

/** 服务日志器 */
export function createServiceLogger(level = 'info'): Logger {
  return createLogger({ level });
}
