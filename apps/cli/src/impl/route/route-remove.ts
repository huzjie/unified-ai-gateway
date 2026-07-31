import { httpClient } from '../../utils/http-client';
import { output } from '../../utils/output';

export async function routeRemove(id: string): Promise<void> {
  const res = await httpClient.delete(`/admin/routes/${id}`);
  output.json(res.data);
  output.success('路由规则已删除');
}
