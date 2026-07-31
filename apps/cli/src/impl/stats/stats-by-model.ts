import { httpClient } from '../../utils/http-client';
import { output } from '../../utils/output';
import { renderTable } from '../../utils/table';

export async function statsByModel(): Promise<void> {
  const res = await httpClient.get('/admin/stats?dimension=model');
  const data = (res.data as { data?: Array<Record<string, unknown>> }).data ?? [];
  if (output.isJson) {
    output.json(data);
    return;
  }
  renderTable(['模型', '请求数', '成功', 'Tokens', '成本'], data.map((r: Record<string, unknown>) => [
    String(r.key ?? ''),
    String(r.requestCount ?? 0),
    String(r.successCount ?? 0),
    String(r.totalTokens ?? 0),
    String(Number(r.costAmount ?? 0).toFixed(4)),
  ]));
}
