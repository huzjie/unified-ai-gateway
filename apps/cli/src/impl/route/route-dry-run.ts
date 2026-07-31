import { httpClient } from '../../utils/http-client';
import { output } from '../../utils/output';

export async function routeDryRun(opts: { model: string; tenant: string }): Promise<void> {
  const res = await httpClient.post('/admin/routes/dry-run', {
    model: opts.model,
    tenant: opts.tenant,
  });
  output.json(res.data);
}
