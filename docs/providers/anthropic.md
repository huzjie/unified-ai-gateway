# Anthropic 适配说明

- 类型：`anthropic`
- 接口：`https://api.anthropic.com/v1/messages`（messages API）
- 鉴权：`x-api-key: <api-key>` + `anthropic-version: 2023-06-01`
- 模型：claude-3-5-sonnet / claude-3-5-haiku / claude-3-opus
- **协议转换要点**：
  - OpenAI `system` 消息 → Anthropic `system` 字段
  - `max_tokens` 必填
  - 流式事件类型转换：message_start / content_block_delta / message_delta / message_stop

## 配置示例

```yaml
providers:
  - name: anthropic-prod
    type: anthropic
    baseUrl: https://api.anthropic.com
    apiKey: sk-ant-xxx
    models: [claude-3-5-sonnet]
```
