import type { Command } from 'commander';
import { keyCreate } from '../impl/key/key-create';
import { keyList } from '../impl/key/key-list';
import { keyRevoke } from '../impl/key/key-revoke';
import { keyUpdate } from '../impl/key/key-update';
import { keyShow } from '../impl/key/key-show';

export function registerKeyCommand(program: Command): void {
  const key = program.command('key').description('API Key 管理');
  key.command('create')
    .description('创建 Key（明文仅此一次返回）')
    .requiredOption('--name <name>', 'Key 名称')
    .requiredOption('--tenant <tenant>', '租户')
    .option('--whitelist <models>', '模型白名单（逗号分隔）')
    .option('--qps <qps>', 'QPS 上限', '100')
    .action(keyCreate);
  key.command('list')
    .description('列出 Keys')
    .option('--tenant <tenant>', '按租户过滤')
    .action(keyList);
  key.command('show <id>').description('查看 Key 详情').action(keyShow);
  key.command('update <id>')
    .description('更新 Key')
    .option('--qps <qps>', 'QPS 上限')
    .option('--concurrency <n>', '并发上限')
    .action(keyUpdate);
  key.command('revoke <id>').description('吊销 Key').action(keyRevoke);
}
