import type { DailyStats } from '@uag/types';

export interface IDailyStatsRepository {
  upsert(stat: Omit<DailyStats, 'id' | 'createdAt' | 'updatedAt'>): void;
  aggregateFromLogs(date: string): void;
  aggregate(dimension: 'model' | 'key' | 'provider' | 'date', startDate?: string, endDate?: string): DailyStats[];
  findByDate(date: string): DailyStats[];
}
