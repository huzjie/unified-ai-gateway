# 管理 API 全量端点

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | /admin/auth/login | 登录 |
| GET | /admin/keys | Key 列表（支持 tenant/status/search/page） |
| POST | /admin/keys | 创建 Key（明文仅此一次返回） |
| PUT | /admin/keys/:id | 更新 Key |
| DELETE | /admin/keys/:id | 吊销 Key |
| GET | /admin/providers | Provider 列表 |
| POST | /admin/providers | 添加 Provider |
| PUT | /admin/providers/:id | 更新 Provider |
| DELETE | /admin/providers/:id | 删除 Provider |
| POST | /admin/providers/:id/test | 测试连接 |
| GET | /admin/routes | 路由规则列表 |
| POST | /admin/routes | 创建路由规则 |
| PUT | /admin/routes/:id | 更新路由规则 |
| DELETE | /admin/routes/:id | 删除路由规则 |
| POST | /admin/routes/dry-run | 干跑路由决策 |
| GET | /admin/logs | 请求日志（多条件筛选） |
| GET | /admin/logs/:id | 日志详情 |
| GET | /admin/stats | 统计聚合（dimension=model/key/provider/date） |
| GET | /admin/dashboard | 仪表盘（?days=N） |
| GET/PUT | /admin/settings | 系统设置 |
| GET | /admin/audit | 审计日志 |
| GET | /admin/export/csv | 用量报表导出 |
