import type { LogFilter, Page, PageResult, UsageLog } from '@uag/types';

export interface IUsageLogRepository {
  insert(log: UsageLog): void;
  findById(id: string): UsageLog | null;
  findByRequestId(requestId: string): UsageLog | null;
  query(filter: LogFilter, page: Page): PageResult<UsageLog>;
  queryRange(filter: LogFilter): UsageLog[];
  deleteOlderThan(iso: string): number;
}
