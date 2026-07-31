import Table from 'cli-table3';

/** 终端表格渲染 */
export function renderTable(headers: string[], rows: string[][]): void {
  const table = new Table({
    head: headers,
    style: { head: ['cyan'], border: ['gray'] },
  });
  for (const row of rows) {
    table.push(row);
  }
  process.stdout.write(`${table.toString()}\n`);
}
