# 错误码表与 HTTP 映射

| 错误码 | HTTP | 含义 | retryable |
|---|---|---|---|
| UAG-0000 | 200 | 成功 | - |
| UAG-1001 | 500 | 配置无效/缺失 | false |
| UAG-1002 | 500 | 初始化失败 | false |
| UAG-2001 | 401 | API Key 无效 | false |
| UAG-2002 | 403 | API Key 已吊销/过期 | false |
| UAG-2003 | 403 | 模型不在白名单 | false |
| UAG-2004 | 401 | 管理员凭证错误 | false |
| UAG-2005 | 401 | JWT 过期/无效 | false |
| UAG-3001 | 429 | QPS 限流 | true |
| UAG-3002 | 429 | 并发数超限 | true |
| UAG-4001 | 502 | 上游 Provider 不可用 | true |
| UAG-4002 | 502 | 全部候选 Provider 失败 | true |
| UAG-4003 | 503 | 熔断 OPEN | true |
| UAG-4004 | 504 | 上游超时 | true |
| UAG-5001 | 502 | 上游返回错误 | false |
| UAG-5002 | 400 | 请求体校验失败 | false |
| UAG-5003 | 404 | 资源不存在 | false |
| UAG-9001 | 500 | 内部错误 | false |

开放 API 错误体：`{ error: { message, type, param, code } }`；429 附带 `Retry-After` 头。
