import { httpClient } from '../../utils/http-client';
import { output } from '../../utils/output';

export async function keyCreate(opts: { name: string; tenant: string; whitelist?: string; qps?: string }): Promise<void> {
  const res = await httpClient.post('/admin/keys', {
    name: opts.name,
    tenant: opts.tenant,
    modelWhitelist: opts.whitelist ? opts.whitelist.split(',') : [],
    qpsLimit: Number(opts.qps ?? 100),
  });
  output.json(res.data);
  if (res.data.plainKey) {
    output.warn('⚠️ 明文 Key 仅此一次显示，请立即保存！');
  }
}
