import { httpClient } from '../../utils/http-client';
import { output } from '../../utils/output';

export async function providerTest(id: string): Promise<void> {
  const res = await httpClient.post(`/admin/providers/${id}/test`, {});
  const data = res.data as { ok?: boolean; latencyMs?: number; message?: string; models?: string[] };
  output.json(data);
  if (data.ok) {
    output.success(`连接正常（${data.latencyMs}ms），模型: ${(data.models ?? []).join(', ')}`);
  } else {
    output.error(`连接失败: ${data.message}`);
  }
}
