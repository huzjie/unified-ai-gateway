import { httpClient } from '../../utils/http-client';
import { output } from '../../utils/output';

export async function routeApply(opts: {
  file?: string;
  name?: string;
  model?: string;
  tenant?: string;
  strategy?: string;
  targets?: string;
}): Promise<void> {
  let payload: Record<string, unknown>;
  if (opts.file) {
    const fs = await import('node:fs');
    const content = fs.readFileSync(opts.file, 'utf-8');
    payload = JSON.parse(content);
  } else {
    if (!opts.name || !opts.targets) {
      output.error('需要 --file 或 --name + --targets');
      return;
    }
    payload = {
      name: opts.name,
      matchModel: opts.model ?? null,
      matchTenant: opts.tenant ?? null,
      strategy: opts.strategy ?? 'priority',
      targets: opts.targets.split(','),
    };
  }
  const res = await httpClient.post('/admin/routes', payload);
  output.json(res.data);
  output.success('路由规则已应用');
}
