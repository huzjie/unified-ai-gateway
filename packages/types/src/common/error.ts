/**
 * 错误码枚举（UAG-XXXX 格式）与错误载荷
 * 完整表见 docs/api/errors.md 与 ARCHITECTURE.md §9.3
 */
export enum ErrorCode {
  SUCCESS = 'UAG-0000',
  CONFIG_INVALID = 'UAG-1001',
  INIT_FAILED = 'UAG-1002',
  API_KEY_INVALID = 'UAG-2001',
  API_KEY_REVOKED = 'UAG-2002',
  MODEL_NOT_ALLOWED = 'UAG-2003',
  ADMIN_CREDENTIALS = 'UAG-2004',
  JWT_INVALID = 'UAG-2005',
  RATE_LIMITED = 'UAG-3001',
  CONCURRENCY_LIMITED = 'UAG-3002',
  PROVIDER_UNAVAILABLE = 'UAG-4001',
  ALL_PROVIDERS_FAILED = 'UAG-4002',
  CIRCUIT_OPEN = 'UAG-4003',
  UPSTREAM_TIMEOUT = 'UAG-4004',
  UPSTREAM_ERROR = 'UAG-5001',
  VALIDATION_FAILED = 'UAG-5002',
  NOT_FOUND = 'UAG-5003',
  INTERNAL_ERROR = 'UAG-9001',
}

/** 错误码 → HTTP 状态码映射 */
export const ERROR_HTTP_STATUS: Record<ErrorCode, number> = {
  [ErrorCode.SUCCESS]: 200,
  [ErrorCode.CONFIG_INVALID]: 500,
  [ErrorCode.INIT_FAILED]: 500,
  [ErrorCode.API_KEY_INVALID]: 401,
  [ErrorCode.API_KEY_REVOKED]: 403,
  [ErrorCode.MODEL_NOT_ALLOWED]: 403,
  [ErrorCode.ADMIN_CREDENTIALS]: 401,
  [ErrorCode.JWT_INVALID]: 401,
  [ErrorCode.RATE_LIMITED]: 429,
  [ErrorCode.CONCURRENCY_LIMITED]: 429,
  [ErrorCode.PROVIDER_UNAVAILABLE]: 502,
  [ErrorCode.ALL_PROVIDERS_FAILED]: 502,
  [ErrorCode.CIRCUIT_OPEN]: 503,
  [ErrorCode.UPSTREAM_TIMEOUT]: 504,
  [ErrorCode.UPSTREAM_ERROR]: 502,
  [ErrorCode.VALIDATION_FAILED]: 400,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.INTERNAL_ERROR]: 500,
};

/** 错误码是否可重试 */
export const ERROR_RETRYABLE: Record<ErrorCode, boolean> = {
  [ErrorCode.SUCCESS]: false,
  [ErrorCode.CONFIG_INVALID]: false,
  [ErrorCode.INIT_FAILED]: false,
  [ErrorCode.API_KEY_INVALID]: false,
  [ErrorCode.API_KEY_REVOKED]: false,
  [ErrorCode.MODEL_NOT_ALLOWED]: false,
  [ErrorCode.ADMIN_CREDENTIALS]: false,
  [ErrorCode.JWT_INVALID]: false,
  [ErrorCode.RATE_LIMITED]: true,
  [ErrorCode.CONCURRENCY_LIMITED]: true,
  [ErrorCode.PROVIDER_UNAVAILABLE]: true,
  [ErrorCode.ALL_PROVIDERS_FAILED]: true,
  [ErrorCode.CIRCUIT_OPEN]: true,
  [ErrorCode.UPSTREAM_TIMEOUT]: true,
  [ErrorCode.UPSTREAM_ERROR]: false,
  [ErrorCode.VALIDATION_FAILED]: false,
  [ErrorCode.NOT_FOUND]: false,
  [ErrorCode.INTERNAL_ERROR]: false,
};

/** 错误载荷（OpenAI 兼容错误体） */
export interface ErrorPayload {
  error: {
    message: string;
    type: string;
    param: string | null;
    code: string;
  };
}

/** 管理面错误响应体 */
export interface AdminErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}
