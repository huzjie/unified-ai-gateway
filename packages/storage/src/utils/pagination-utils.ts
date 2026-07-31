import type { Page } from '@uag/types';
import { normalizePage } from '@uag/types';

/**
 * 分页 SQL 生成
 */
export class PaginationUtils {
  /** 分页 SQL 片段 */
  static paginate(page?: number, pageSize?: number): { sql: string; params: number[]; page: Page } {
    const p = normalizePage(page, pageSize);
    const offset = (p.page - 1) * p.pageSize;
    return { sql: 'LIMIT ? OFFSET ?', params: [p.pageSize, offset], page: p };
  }

  /** 计算总页数 */
  static totalPages(total: number, pageSize: number): number {
    return total === 0 ? 0 : Math.ceil(total / pageSize);
  }
}
