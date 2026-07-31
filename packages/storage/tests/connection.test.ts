import { SQLiteConnection, ConnectionFactory, createMemoryConnection } from '../src/connection';

describe('connection', () => {
  it('创建连接并执行 SQL', () => {
    const conn = createMemoryConnection();
    conn.exec('CREATE TABLE t (id INTEGER PRIMARY KEY, name TEXT)');
    conn.prepare('INSERT INTO t (name) VALUES (?)').run('x');
    const row = conn.prepare('SELECT * FROM t').get() as { id: number; name: string };
    expect(row.name).toBe('x');
    conn.close();
  });

  it('ConnectionFactory 按类型创建', () => {
    const factory = new ConnectionFactory({ type: 'memory', databasePath: ':memory:' });
    const conn = factory.create();
    expect(conn).toBeInstanceOf(SQLiteConnection);
    conn.close();
  });

  it('事务', () => {
    const conn = createMemoryConnection();
    conn.exec('CREATE TABLE t (id INTEGER PRIMARY KEY, v INTEGER)');
    conn.transaction(() => {
      conn.prepare('INSERT INTO t (v) VALUES (?)').run(1);
      conn.prepare('INSERT INTO t (v) VALUES (?)').run(2);
    });
    const rows = conn.prepare('SELECT COUNT(*) as cnt FROM t').get() as { cnt: number };
    expect(rows.cnt).toBe(2);
    conn.close();
  });
});
