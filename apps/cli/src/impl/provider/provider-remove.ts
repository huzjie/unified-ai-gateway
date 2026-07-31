import { httpClient } from '../../utils/http-client';
import { output } from '../../utils/output';

export async function providerRemove(id: string): Promise<void> {
  const res = await httpClient.delete(`/admin/providers/${id}`);
  output.json(res.data);
  output.success('Provider 已删除');
}
