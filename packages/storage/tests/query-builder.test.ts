import { QueryBuilder } from '../src/services/query-builder';
import { SQL_UTILS } from '../src/utils/sql-utils';

describe('QueryBuilder', () => {
  it('构造 WHERE', () => {
    const where = QueryBuilder.where([
      { column: 'tenant', value: 'data' },
      { column: 'status', value: 'active' },
    ]);
    expect(where.sql).toContain('tenant = ?');
    expect(where.params).toEqual(['data', 'active']);
  });

  it('忽略 undefined 条件', () => {
    const where = QueryBuilder.where([{ column: 'tenant', value: undefined }]);
    expect(where.sql).toBe('');
  });

  it('LIKE 条件', () => {
    const like = QueryBuilder.like('name', 'dev');
    expect(like.sql).toBe('name LIKE ?');
    expect(like.params).toEqual(['%dev%']);
  });

  it('非法列名抛错', () => {
    expect(() => QueryBuilder.safeColumn('name; DROP TABLE')).toThrow();
  });

  it('orderBy 白名单', () => {
    expect(QueryBuilder.orderBy('created_at', 'desc', ['created_at'])).toBe('ORDER BY created_at DESC');
    expect(QueryBuilder.orderBy('evil', 'asc', ['created_at'])).toBe('ORDER BY created_at ASC');
  });

  it('SQL_UTILS buildInsert', () => {
    const { sql, params } = SQL_UTILS.buildInsert('t', { a: 1, b: 'x' });
    expect(sql).toBe('INSERT INTO t (a, b) VALUES (?, ?)');
    expect(params).toEqual([1, 'x']);
  });
});
