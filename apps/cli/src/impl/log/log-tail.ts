import { output } from '../../utils/output';

export async function logTail(): Promise<void> {
  output.warn('log tail 需要网关日志流支持，请使用 log search');
}
