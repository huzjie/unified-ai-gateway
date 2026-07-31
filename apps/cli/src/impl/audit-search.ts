import { httpClient } from '../utils/http-client';
import { output } from '../utils/output';

export async function auditSearch(): Promise<void> {
  const res = await httpClient.get('/admin/audit');
  output.json(res.data);
}
