import { httpClient } from '../../utils/http-client';
import { output } from '../../utils/output';

export async function keyUpdate(id: string, opts: { qps?: string; concurrency?: string }): Promise<void> {
  const body: Record<string, unknown> = {};
  if (opts.qps) body.qpsLimit = Number(opts.qps);
  if (opts.concurrency) body.concurrencyLimit = Number(opts.concurrency);
  const res = await httpClient.put(`/admin/keys/${id}`, body);
  output.json(res.data);
  output.success('Key 已更新');
}
