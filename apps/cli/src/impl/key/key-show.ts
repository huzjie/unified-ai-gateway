import { httpClient } from '../../utils/http-client';
import { output } from '../../utils/output';

export async function keyShow(id: string): Promise<void> {
  const list = await httpClient.get('/admin/keys');
  const item = ((list.data as { items?: Array<Record<string, unknown>> }).items ?? []).find((k: Record<string, unknown>) => k.id === id);
  if (!item) {
    output.error(`Key ${id} 不存在`);
    return;
  }
  output.json(item);
}
