import type { Command } from 'commander';
import { statsSummary } from '../impl/stats/stats-summary';
import { statsByKey } from '../impl/stats/stats-by-key';
import { statsByModel } from '../impl/stats/stats-by-model';
import { statsDaily } from '../impl/stats/stats-daily';

export function registerStatsCommand(program: Command): void {
  const stats = program.command('stats').description('用量统计');
  stats.command('summary').description('汇总').action(statsSummary);
  stats.command('by-model').description('按模型聚合').action(statsByModel);
  stats.command('by-key').description('按 Key 聚合').action(statsByKey);
  stats.command('daily').description('按日聚合').action(statsDaily);
}
