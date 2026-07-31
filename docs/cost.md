# 成本说明

## 计价口径

- 配置文件声明单价（CNY / 1K tokens）
- 成本 = inputTokens/1000 × 输入单价 + outputTokens/1000 × 输出单价 + 按请求固定费用
- **整数微元运算**（1 元 = 1_000_000 微元）避免浮点误差
- 落库保留 6 位小数，展示四舍五入 4 位；币种统一 CNY

## 配置示例

```json
{
  "pricing": {
    "kimi-k3": { "input": 4, "output": 16 },
    "deepseek-chat": { "input": 1, "output": 2 }
  }
}
```

## Token 计数

- 优先使用上游 `usage` 字段
- 缺失时用 token-counter 估算（字符数/4 近似）

## 聚合

- `usage_logs`：请求级明细（实时插入）
- `daily_stats`：按日预聚合（请求后异步 upsert）
- 查询类接口走聚合表，仪表盘直查
