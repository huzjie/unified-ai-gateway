import { httpClient } from '../utils/http-client';
import { output } from '../utils/output';
import { writeFileSync } from 'node:fs';

export async function exportCsv(start?: string, end?: string): Promise<void> {
  const params = new URLSearchParams();
  if (start) params.set('startTime', start);
  if (end) params.set('endTime', end);
  const res = await httpClient.getRaw(`/admin/export/csv?${params.toString()}`);
  const filename = `usage-report-${Date.now()}.csv`;
  writeFileSync(filename, res);
  output.success(`已导出到 ${filename}`);
}
