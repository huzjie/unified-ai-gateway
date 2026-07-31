# 日志/指标/健康检查

## 日志

- JSON Lines 输出：`{"ts":"...","level":"info","reqId":"uag-...","module":"chat-service","msg":"..."}`
- 必带字段：ts / level / reqId / module / msg
- 请求日志经事件总线写库（usage_logs）；审计操作写 audit_logs

## 指标

- 内存计数（metrics-listener）：QPS / 失败率 / 熔断状态
- 仪表盘直查聚合数据

## 健康检查

- `/healthz`：进程存活
- `/readyz`：DB / Provider 注册 / 路由规则就绪

## 响应头

- x-request-id
- x-uag-provider / x-uag-failover / x-uag-cost（微元）/ x-uag-latency
