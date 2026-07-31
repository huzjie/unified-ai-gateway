/**
 * 分页类型工具测试
 */
import { normalizePage, toPageResult, DEFAULT_PAGE, MAX_PAGE_SIZE } from '../src/index';

describe('pagination utils', () => {
  it('默认分页', () => {
    expect(DEFAULT_PAGE).toEqual({ page: 1, pageSize: 20 });
    expect(MAX_PAGE_SIZE).toBe(100);
  });

  it('边界值归一化', () => {
    expect(normalizePage(-5, -1)).toEqual({ page: 1, pageSize: 1 });
    expect(normalizePage(2.9, 10.5)).toEqual({ page: 2, pageSize: 10 });
    expect(normalizePage(1, 999)).toEqual({ page: 1, pageSize: 100 });
  });

  it('分页结果计算', () => {
    const r = toPageResult(['a'], 21, { page: 2, pageSize: 20 });
    expect(r.total).toBe(21);
    expect(r.totalPages).toBe(2);
    const empty = toPageResult([], 0, { page: 1, pageSize: 20 });
    expect(empty.totalPages).toBe(0);
  });
});
