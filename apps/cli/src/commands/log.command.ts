import type { Command } from 'commander';
import { logSearch } from '../impl/log/log-search';
import { logTail } from '../impl/log/log-tail';

export function registerLogCommand(program: Command): void {
  const log = program.command('log').description('请求日志');
  log.command('search')
    .description('搜索日志')
    .option('--model <model>', '按模型过滤')
    .option('--provider <provider>', '按 Provider 过滤')
    .option('--status <code>', '按状态码过滤')
    .option('--keyword <kw>', '搜索关键词')
    .option('--limit <n>', '条数', '20')
    .action(logSearch);
  log.command('tail').description('实时尾随日志').action(logTail);
}
