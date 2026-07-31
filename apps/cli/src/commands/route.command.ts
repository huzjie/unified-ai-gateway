import type { Command } from 'commander';
import { routeApply } from '../impl/route/route-apply';
import { routeList } from '../impl/route/route-list';
import { routeRemove } from '../impl/route/route-remove';
import { routeDryRun } from '../impl/route/route-dry-run';

export function registerRouteCommand(program: Command): void {
  const route = program.command('route').description('路由规则管理');
  route.command('apply')
    .description('应用路由规则（--file 或参数）')
    .option('--file <file>', '规则 JSON/YAML 文件')
    .option('--name <name>', '规则名')
    .option('--model <model>', '匹配模型')
    .option('--tenant <tenant>', '匹配租户')
    .option('--strategy <strategy>', '策略: priority/failover/cost-first/random', 'priority')
    .option('--targets <targets>', '目标 Provider（逗号分隔）')
    .action(routeApply);
  route.command('list').description('列出规则').action(routeList);
  route.command('remove <id>').description('删除规则').action(routeRemove);
  route.command('dry-run')
    .description('干跑：查看路由决策')
    .requiredOption('--model <model>', '模型')
    .option('--tenant <tenant>', '租户', 'default')
    .action(routeDryRun);
}
