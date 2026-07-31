import { httpClient } from '../../utils/http-client';
import { output } from '../../utils/output';
import { renderTable } from '../../utils/table';

export async function routeList(): Promise<void> {
  const res = await httpClient.get('/admin/routes');
  const items = (res.data as { items?: Array<Record<string, unknown>> }).items ?? [];
  if (output.isJson) {
    output.json(res.data);
    return;
  }
  renderTable(['名称', '匹配模型', '匹配租户', '策略', '目标'], items.map((r: Record<string, unknown>) => [
    String(r.name ?? ''),
    String(r.matchModel ?? '*'),
    String(r.matchTenant ?? '*'),
    String(r.strategy ?? ''),
    String((r.targets as string[])?.join(' → ') ?? ''),
  ]));
}
