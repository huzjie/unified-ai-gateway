import { ErrorCode } from '@uag/types';

/**
 * 错误码常量表
 * 完整错误码见 @uag/types 的 ErrorCode 枚举；此处提供别名常量与描述。
 */
export const ERROR_CODES = ErrorCode;

/** 错误码 → 中文描述 */
export const ERROR_CODE_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.SUCCESS]: '成功',
  [ErrorCode.CONFIG_INVALID]: '配置无效或缺失',
  [ErrorCode.INIT_FAILED]: '初始化失败（数据库/迁移/加密密钥）',
  [ErrorCode.API_KEY_INVALID]: 'API Key 无效',
  [ErrorCode.API_KEY_REVOKED]: 'API Key 已吊销或过期',
  [ErrorCode.MODEL_NOT_ALLOWED]: '模型不在 API Key 白名单',
  [ErrorCode.ADMIN_CREDENTIALS]: '��理员凭证错误',
  [ErrorCode.JWT_INVALID]: 'JWT 过期或无效',
  [ErrorCode.RATE_LIMITED]: 'QPS 限流',
  [ErrorCode.CONCURRENCY_LIMITED]: '并发数超限',
  [ErrorCode.PROVIDER_UNAVAILABLE]: '上游 Provider 不可用',
  [ErrorCode.ALL_PROVIDERS_FAILED]: '全部候选 Provider 失败',
  [ErrorCode.CIRCUIT_OPEN]: '熔断打开',
  [ErrorCode.UPSTREAM_TIMEOUT]: '上游超时',
  [ErrorCode.UPSTREAM_ERROR]: '上游返回错误',
  [ErrorCode.VALIDATION_FAILED]: '请求体校验失败',
  [ErrorCode.NOT_FOUND]: '资源不存在',
  [ErrorCode.INTERNAL_ERROR]: '内部错误',
};

/** 获取错误码默认消息 */
export function getErrorMessage(code: ErrorCode): string {
  return ERROR_CODE_MESSAGES[code] ?? ERROR_CODE_MESSAGES[ErrorCode.INTERNAL_ERROR];
}
