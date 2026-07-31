import { httpClient } from '../../utils/http-client';
import { output } from '../../utils/output';
import { renderTable } from '../../utils/table';

export async function keyList(opts: { tenant?: string }): Promise<void> {
  const params = new URLSearchParams();
  if (opts.tenant) params.set('tenant', opts.tenant);
  const res = await httpClient.get(`/admin/keys?${params.toString()}`);
  const items = (res.data as { items?: Array<Record<string, unknown>> }).items ?? [];
  if (output.isJson) {
    output.json(res.data);
    return;
  }
  renderTable(['名称', '前缀', '租户', '状态', 'QPS'], items.map((k: Record<string, unknown>) => [
    String(k.name ?? ''),
    String(k.keyPrefix ?? ''),
    String(k.tenant ?? ''),
    String(k.status ?? ''),
    String(k.qpsLimit ?? ''),
  ]));
}
