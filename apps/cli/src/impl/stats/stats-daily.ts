import { httpClient } from '../../utils/http-client';
import { output } from '../../utils/output';
import { renderTable } from '../../utils/table';

export async function statsDaily(): Promise<void> {
  const res = await httpClient.get('/admin/stats?dimension=date');
  const data = (res.data as { data?: Array<Record<string, unknown>> }).data ?? [];
  if (output.isJson) {
    output.json(data);
    return;
  }
  renderTable(['日期', '请求数', 'Tokens', '成本'], data.map((r: Record<string, unknown>) => [
    String(r.key ?? ''),
    String(r.requestCount ?? 0),
    String(r.totalTokens ?? 0),
    String(Number(r.costAmount ?? 0).toFixed(4)),
  ]));
}
