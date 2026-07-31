import { httpClient } from '../../utils/http-client';
import { output } from '../../utils/output';
import { renderTable } from '../../utils/table';

export async function logSearch(opts: {
  model?: string;
  provider?: string;
  status?: string;
  keyword?: string;
  limit?: string;
}): Promise<void> {
  const params = new URLSearchParams();
  if (opts.model) params.set('model', opts.model);
  if (opts.provider) params.set('provider', opts.provider);
  if (opts.status) params.set('statusCode', opts.status);
  if (opts.keyword) params.set('search', opts.keyword);
  params.set('pageSize', opts.limit ?? '20');
  const res = await httpClient.get(`/admin/logs?${params.toString()}`);
  const items = (res.data as { items?: Array<Record<string, unknown>> }).items ?? [];
  if (output.isJson) {
    output.json(res.data);
    return;
  }
  renderTable(['时间', '模型', 'Provider', '状态', '耗时ms', 'Tokens'], items.map((l: Record<string, unknown>) => [
    String((l.createdAt as string ?? '').slice(11, 23)),
    String(l.model ?? ''),
    String(l.provider ?? ''),
    String(l.statusCode ?? ''),
    String(l.latencyMs ?? ''),
    String(l.totalTokens ?? ''),
  ]));
}
