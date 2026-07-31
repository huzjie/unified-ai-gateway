/** 管理 API 响应类型 */
export interface ApiResponse<T = unknown> {
  code: number | string;
  data: T;
  message: string;
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}
