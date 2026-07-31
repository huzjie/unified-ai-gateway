import { httpClient } from '../../utils/http-client';
import { output } from '../../utils/output';

export async function keyRevoke(id: string): Promise<void> {
  const res = await httpClient.delete(`/admin/keys/${id}`);
  output.json(res.data);
  output.success('Key 已吊销');
}
