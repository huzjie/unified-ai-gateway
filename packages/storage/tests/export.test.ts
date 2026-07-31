import { csvExport, csvEscape } from '../src/utils/export-utils';

describe('export utils', () => {
  it('CSV 转义', () => {
    expect(csvEscape('simple')).toBe('simple');
    expect(csvEscape('a,b')).toBe('"a,b"');
    expect(csvEscape('say "hi"')).toBe('"say ""hi"""');
    expect(csvEscape(null)).toBe('');
  });

  it('生成 CSV', () => {
    const csv = csvExport({
      columns: [
        { header: '模型', key: 'model' },
        { header: '调用数', key: 'count' },
      ],
      rows: [
        { model: 'kimi-k3', count: 42 },
        { model: 'deepseek, v4', count: 7 },
      ],
    });
    expect(csv).toContain('模型,调用数');
    expect(csv).toContain('kimi-k3,42');
    expect(csv).toContain('"deepseek, v4",7');
  });
});
