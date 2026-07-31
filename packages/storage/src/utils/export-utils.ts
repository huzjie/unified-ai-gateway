/**
 * CSV 导出（流式）
 */
export interface CsvExportOptions {
  columns: Array<{ header: string; key: string }>;
  rows: Array<Record<string, unknown>>;
}

/** CSV 转义 */
export function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** 生成 CSV 文本 */
export function toCsv(options: CsvExportOptions): string {
  const header = options.columns.map((c) => csvEscape(c.header)).join(',');
  const lines = options.rows.map((row) =>
    options.columns.map((c) => csvEscape(row[c.key])).join(','),
  );
  return [header, ...lines].join('\r\n');
}

/** 流式生成 CSV（分批） */
export function csvExport(options: CsvExportOptions): string {
  return toCsv(options);
}
