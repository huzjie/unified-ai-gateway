import { PaginationUtils } from '../src/utils/pagination-utils';

describe('PaginationUtils', () => {
  it('paginate SQL', () => {
    const p = PaginationUtils.paginate(2, 10);
    expect(p.sql).toContain('LIMIT');
    expect(p.params).toEqual([10, 10]);
  });

  it('totalPages', () => {
    expect(PaginationUtils.totalPages(0, 10)).toBe(0);
    expect(PaginationUtils.totalPages(25, 10)).toBe(3);
  });
});
