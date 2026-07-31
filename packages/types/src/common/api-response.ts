/**
 * 管理 API 统一响应格式
 * 约定：{ code: 0, data: T, message: 'ok' }；业务错误 code 为 UAG-XXXX
 */
import type { PageResult } from './pagination';
export interface ApiResponse<T = unknown> {
  /** 0 表示成功；业务错误为 UAG-XXXX 错误码 */
  code: number | string;
  data: T;
  message: string;
}

/** 分页结果包装 */
export interface PagedApiResponse<T> extends ApiResponse<PageResult<T>> {
  data: PageResult<T>;
}

/** 统一响应构造工具 */
export function ok<T>(data: T, message = 'ok'): ApiResponse<T> {
  return { code: 0, data, message };
}

export function fail<T = null>(code: string | number, message: string, data: T = null as T): ApiResponse<T> {
  return { code, data, message };
}
