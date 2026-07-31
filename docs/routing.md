# 路由规则

## 规则结构

```json
{
  "name": "main-chat",
  "priority": 1,
  "matchModel": "my-main",
  "matchTenant": null,
  "strategy": "priority",
  "targets": ["moonshot", "deepseek"],
  "fallbackTargets": ["ollama"],
  "breakerThreshold": 0.5,
  "enabled": true
}
```

- `matchModel` / `matchTenant`：支持 `*` 通配（前缀/后缀）
- `priority`：数字越小优先级越高
- `targets`：有序 Provider 候选（别名解析后映射实际模型）

## 4 种策略

| 策略 | 说明 |
|---|---|
| priority | 选择候选列表第一个健康 Provider（primary/fallback） |
| failover | 故障转移：跳过失败 Provider |
| cost-first | 选择输入单价最低的 Provider |
| random | 随机选择（支持权重） |

## 模型别名

`aliases` 将虚拟模型名映射到候选列表：

```json
{
  "aliases": {
    "my-main": ["moonshot", "deepseek"]
  }
}
```

业务侧只认 `my-main`，底层随时可换。
