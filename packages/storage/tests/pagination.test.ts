import { Paginator } from '../src/services/paginator';
import { PaginationUtils } from '../src/utils/pagination-utils';

describe('paginator', () => {
  it('normalize', () => {
    expect(Paginator.normalize()).toEqual({ page: 1, pageSize: 20 });
    expect(Paginator.normalize(2, 50)).toEqual({ page: 2, pageSize: 50 });
    expect(Paginator.normalize(0, 999)).toEqual({ page: 1, pageSize: 100 });
  });

  it('wrap 结果', () => {
    const result = Paginator.wrap([1, 2], 42, { page: 3, pageSize: 20 });
    expect(result.totalPages).toBe(3);
    expect(result.items).toEqual([1, 2]);
  });

  it('buildSql', () => {
    const { sql, params, page } = Paginator.buildSql(2, 10);
    expect(sql).toBe('LIMIT ? OFFSET ?');
    expect(params).toEqual([10, 10]);
    expect(page.page).toBe(2);
  });

  it('PaginationUtils', () => {
    expect(PaginationUtils.totalPages(0, 10)).toBe(0);
    expect(PaginationUtils.totalPages(25, 10)).toBe(3);
    const p = PaginationUtils.paginate(1, 20);
    expect(p.sql).toContain('LIMIT');
  });
});
