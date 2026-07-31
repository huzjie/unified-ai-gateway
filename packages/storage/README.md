# @uag/storage

统一 AI 网关存储层：Repository 接口 + better-sqlite3 实现 + 内存 fallback + 迁移管理。

## 模块

- `connection/` — SQLite 连接封装（WAL、外键）
- `schema/` — 表结构定义 / 约束 / 触发器
- `migrations/` — 迁移执行器 + SQL 脚本
- `repositories/` — 仓储实现 + 接口
- `services/` — Key 哈希/生成、ID、序列化、查询构建
- `db/` — 数据库门面与事务
- `memory/` — 内存 fallback 实现
- `factory/` — 仓储组与存储总工厂
- `utils/` — SQL 工具 / 分页 / 聚合 / 导出 / 保留

## 表

providers / api_keys / route_rules / usage_logs / daily_stats / settings / audit_logs / context_cache / webhooks / quota_usage / schema_migrations
