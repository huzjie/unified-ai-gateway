import type { Page } from '@uag/types';
import { normalizePage } from '@uag/types';

/** 解析分页参数 */
export function parsePagination(query: { page?: string | number; pageSize?: string | number }): Page {
  const page = typeof query.page === 'string' ? Number(query.page) : query.page;
  const pageSize = typeof query.pageSize === 'string' ? Number(query.pageSize) : query.pageSize;
  return normalizePage(page, pageSize);
}
