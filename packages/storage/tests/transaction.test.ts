import { withTransaction } from '../src/db/transaction';
import { createMemoryConnection } from '../src/connection/memory-connection';

describe('transaction', () => {
  it('withTransaction 提交', () => {
    const conn = createMemoryConnection();
    conn.exec('CREATE TABLE t (id INTEGER PRIMARY KEY, v INTEGER)');
    withTransaction(conn, () => {
      conn.prepare('INSERT INTO t (v) VALUES (?)').run(1);
    });
    const row = conn.prepare('SELECT COUNT(*) as cnt FROM t').get() as { cnt: number };
    expect(row.cnt).toBe(1);
    conn.close();
  });

  it('异常回滚', () => {
    const conn = createMemoryConnection();
    conn.exec('CREATE TABLE t (id INTEGER PRIMARY KEY, v INTEGER)');
    expect(() =>
      withTransaction(conn, () => {
        conn.prepare('INSERT INTO t (v) VALUES (?)').run(1);
        throw new Error('boom');
      }),
    ).toThrow('boom');
    const row = conn.prepare('SELECT COUNT(*) as cnt FROM t').get() as { cnt: number };
    expect(row.cnt).toBe(0);
    conn.close();
  });
});
