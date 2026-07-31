import { httpClient } from '../../utils/http-client';
import { output } from '../../utils/output';

export async function statsSummary(): Promise<void> {
  const res = await httpClient.get('/admin/dashboard?days=7');
  output.json(res.data.metrics);
}
