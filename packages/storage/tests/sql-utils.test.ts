import { SQL_UTILS } from '../src/utils/sql-utils';

describe('sql-utils', () => {
  it('占位符', () => {
    expect(SQL_UTILS.placeholder(3)).toBe('?, ?, ?');
  });

  it('列名安全校验', () => {
    expect(SQL_UTILS.safeColumn('created_at')).toBe('created_at');
    expect(() => SQL_UTILS.safeColumn('a; DROP')).toThrow();
  });

  it('buildInsert', () => {
    const { sql, params } = SQL_UTILS.buildInsert('users', { id: 1, name: 'a' });
    expect(sql).toBe('INSERT INTO users (id, name) VALUES (?, ?)');
    expect(params).toEqual([1, 'a']);
  });

  it('buildUpdate', () => {
    const { set, params } = SQL_UTILS.buildUpdate({ name: 'b' });
    expect(set).toBe('name = ?');
    expect(params).toEqual(['b']);
  });
});
