# /v1/models

返回网关可用模型清单（虚拟模型别名 + 各 Provider 真实模型）。

```bash
curl http://localhost:8787/v1/models -H "Authorization: Bearer sk-demo-xxx"
```

响应：

```json
{
  "object": "list",
  "data": [
    { "id": "my-main", "object": "model", "owned_by": "alias" },
    { "id": "kimi-k3", "object": "model", "owned_by": "moonshot" }
  ]
}
```
