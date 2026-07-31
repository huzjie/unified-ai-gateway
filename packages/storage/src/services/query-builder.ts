/**
 * 安全动态 SQL 构建（防注入）
 * 仅白名单列名，值一律使用绑定参数。
 */
export interface WhereClause {
  sql: string;
  params: unknown[];
}

export class QueryBuilder {
  /** 构造 WHERE 子句（AND 连接） */
  static where(conditions: Array<{ column: string; op?: string; value: unknown }>): WhereClause {
    const clauses: string[] = [];
    const params: unknown[] = [];
    for (const cond of conditions) {
      if (cond.value === undefined || cond.value === null) {
        continue;
      }
      const op = cond.op ?? '=';
      clauses.push(`${QueryBuilder.safeColumn(cond.column)} ${op} ?`);
      params.push(cond.value);
    }
    return {
      sql: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
      params,
    };
  }

  /** 构造 LIKE 条件 */
  static like(column: string, keyword: string): WhereClause {
    return {
      sql: `${QueryBuilder.safeColumn(column)} LIKE ?`,
      params: [`%${keyword}%`],
    };
  }

  /** 列名白名单校验（防注入） */
  static safeColumn(column: string): string {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(column)) {
      throw new Error(`非法列名: ${column}`);
    }
    return column;
  }

  /** 排序子句 */
  static orderBy(sortBy: string | undefined, order: 'asc' | 'desc' = 'desc', whitelist: string[], fallback = 'created_at'): string {
    const column = sortBy && whitelist.includes(sortBy) ? sortBy : fallback;
    const dir = order === 'asc' ? 'ASC' : 'DESC';
    return `ORDER BY ${QueryBuilder.safeColumn(column)} ${dir}`;
  }

  /** 分页子句 */
  static paginate(page: number, pageSize: number): { sql: string; params: number[] } {
    const offset = (page - 1) * pageSize;
    return { sql: 'LIMIT ? OFFSET ?', params: [pageSize, offset] };
  }
}
