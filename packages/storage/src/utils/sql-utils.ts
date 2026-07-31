/**
 * SQL 常量/占位符工具
 */
export const SQL_UTILS = {
  /** 通用占位符 */
  placeholder: (count: number): string => Array(count).fill('?').join(', '),

  /** 当前时间（ISO） */
  nowIso: (): string => new Date().toISOString(),

  /** 列名安全校验 */
  safeColumn: (column: string): string => {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(column)) {
      throw new Error(`非法列名: ${column}`);
    }
    return column;
  },

  /** 从记录提取插入列/占位符/参数 */
  buildInsert(table: string, data: Record<string, unknown>): { sql: string; params: unknown[] } {
    const keys = Object.keys(data);
    const cols = keys.map(SQL_UTILS.safeColumn).join(', ');
    const placeholders = SQL_UTILS.placeholder(keys.length);
    return {
      sql: `INSERT INTO ${table} (${cols}) VALUES (${placeholders})`,
      params: keys.map((k) => data[k]),
    };
  },

  /** 构建更新子句 */
  buildUpdate(data: Record<string, unknown>): { set: string; params: unknown[] } {
    const keys = Object.keys(data);
    return {
      set: keys.map((k) => `${SQL_UTILS.safeColumn(k)} = ?`).join(', '),
      params: keys.map((k) => data[k]),
    };
  },
};
