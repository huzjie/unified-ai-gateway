import { httpClient } from '../../utils/http-client';
import { output } from '../../utils/output';
import { renderTable } from '../../utils/table';

export async function providerList(): Promise<void> {
  const res = await httpClient.get('/admin/providers');
  const items = (res.data as { items?: Array<Record<string, unknown>> }).items ?? [];
  if (output.isJson) {
    output.json(res.data);
    return;
  }
  renderTable(['名称', '类型', 'Base URL', '状态', '健康'], items.map((p: Record<string, unknown>) => [
    String(p.name ?? ''),
    String(p.type ?? ''),
    String(p.baseUrl ?? ''),
    String(p.enabled ?? ''),
    String(p.healthStatus ?? ''),
  ]));
}
