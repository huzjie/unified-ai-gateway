/**
 * 分页参数与结果类型
 * 约定：page 从 1 起，pageSize ≤ 100
 */
export interface Page {
  /** 页码，从 1 起 */
  page: number;
  /** 每页条数，≤ 100 */
  pageSize: number;
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  /** 总页数 */
  totalPages: number;
}

/** 默认分页参数 */
export const DEFAULT_PAGE: Page = { page: 1, pageSize: 20 };

export const MAX_PAGE_SIZE = 100;

/** 归一化分页参数 */
export function normalizePage(page?: number, pageSize?: number): Page {
  const p = Math.max(1, Math.floor(page ?? DEFAULT_PAGE.page));
  const ps = Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(pageSize ?? DEFAULT_PAGE.pageSize)));
  return { page: p, pageSize: ps };
}

/** 由 items/total 构造分页结果 */
export function toPageResult<T>(items: T[], total: number, page: Page): PageResult<T> {
  const totalPages = total === 0 ? 0 : Math.ceil(total / page.pageSize);
  return { items, total, page: page.page, pageSize: page.pageSize, totalPages };
}
