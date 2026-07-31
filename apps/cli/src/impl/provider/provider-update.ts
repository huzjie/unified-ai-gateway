import { httpClient } from '../../utils/http-client';
import { output } from '../../utils/output';

export async function providerUpdate(id: string, opts: { baseUrl?: string; apiKey?: string; enabled?: string }): Promise<void> {
  const body: Record<string, unknown> = {};
  if (opts.baseUrl) body.baseUrl = opts.baseUrl;
  if (opts.apiKey) body.apiKey = opts.apiKey;
  if (opts.enabled) body.enabled = opts.enabled;
  const res = await httpClient.put(`/admin/providers/${id}`, body);
  output.json(res.data);
  output.success('Provider 已更新');
}
