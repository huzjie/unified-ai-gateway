import { toCsv } from '../src/utils/csv';

describe('csv utils', () => {
  it('生成 CSV', () => {
    const csv = toCsv(['a', 'b'], [[1, 'x'], [2, 'y']]);
    expect(csv).toContain('a,b');
    expect(csv).toContain('1,x');
  });

  it('转义逗号', () => {
    const csv = toCsv(['v'], [['a,b']]);
    expect(csv).toContain('"a,b"');
  });
});
