import { httpClient } from '../../utils/http-client';
import { output } from '../../utils/output';

export async function providerAdd(opts: {
  name: string;
  type: string;
  baseUrl: string;
  apiKey?: string;
  models?: string;
}): Promise<void> {
  const res = await httpClient.post('/admin/providers', {
    name: opts.name,
    type: opts.type,
    baseUrl: opts.baseUrl,
    apiKey: opts.apiKey,
    models: opts.models ? opts.models.split(',') : [],
  });
  output.json(res.data);
  output.success('Provider 已添加');
}
