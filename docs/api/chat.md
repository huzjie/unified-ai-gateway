# /v1/chat/completions

OpenAI 兼容对话接口。

## 请求

```bash
curl http://localhost:8787/v1/chat/completions \
  -H "Authorization: Bearer sk-demo-xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "my-main",
    "messages": [{"role": "user", "content": "你好"}],
    "temperature": 0.7
  }'
```

## 流式

```bash
curl -N http://localhost:8787/v1/chat/completions \
  -H "Authorization: Bearer sk-demo-xxx" \
  -d '{"model":"my-main","messages":[{"role":"user","content":"你好"}],"stream":true}'
```

## 响应

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1750000000,
  "model": "kimi-k3",
  "choices": [{ "index": 0, "message": { "role": "assistant", "content": "你好！" }, "finish_reason": "stop" }],
  "usage": { "prompt_tokens": 12, "completion_tokens": 5, "total_tokens": 17 }
}
```

## 响应头（网关扩展）

- `x-request-id`：关联 ID
- `x-uag-provider`：实际执行 Provider
- `x-uag-failover`：故障转移链（如 moonshot->deepseek）
- `x-uag-cost`：成本（微元）
