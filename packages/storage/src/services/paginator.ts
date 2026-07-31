import type { Page, PageResult } from '@uag/types';
import { normalizePage, toPageResult } from '@uag/types';

/**
 * 分页/排序/过滤参数归一
 */
export interface ListOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  [key: string]: unknown;
}

export class Paginator {
  /** 归一化分页 */
  static normalize(page?: number, pageSize?: number): Page {
    return normalizePage(page, pageSize);
  }

  /** 包装分页结果 */
  static wrap<T>(items: T[], total: number, page: Page): PageResult<T> {
    return toPageResult(items, total, page);
  }

  /** 从 SQL 查询构造分页（自动补 LIMIT/OFFSET） */
  static buildSql(page?: number, pageSize?: number): { sql: string; params: number[]; page: Page } {
    const normalized = normalizePage(page, pageSize);
    const offset = (normalized.page - 1) * normalized.pageSize;
    return {
      sql: 'LIMIT ? OFFSET ?',
      params: [normalized.pageSize, offset],
      page: normalized,
    };
  }
}
