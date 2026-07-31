# @uag/types

全仓共享 TypeScript 类型定义，是领域类型的**唯一来源**。

> 规则：任何跨包共享的类型必须定义在此包，禁止在其他包重复定义。

## 目录

- `common/` — 通用类型（API 响应 / 分页 / 错误 / 时间 / 金额 / 状态）
- `provider/` — Provider 领域类型（实体 / 配置 / 模型 / 计价 / 适配器 / 请求响应 / SSE）
- `gateway/` — 网关 API 类型（chat / models / 路由 / 用量 / 请求上下文）
- `admin/` — 管理面类型（Key / Provider 视图 / 日志 / 统计 / 设置 / 审计 / 仪表盘 / 用户）
- `config/` — 配置类型
- `events/` — 事件类型

## 命名

- 接口 `PascalCase`，仓储接口加 `I` 前缀
- 类型文件按实体单文件
