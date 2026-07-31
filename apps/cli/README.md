# @uag/cli

统一 AI 网关命令行管理工具（gateway-cli）。

## 用法

```bash
gateway-cli key create --name demo --tenant dev
gateway-cli key list
gateway-cli key revoke <id>
gateway-cli provider add --name moonshot --type moonshot --base-url https://api.moonshot.cn/v1
gateway-cli provider list
gateway-cli provider test <id>
gateway-cli route apply --file route.yaml
gateway-cli route list
gateway-cli route dry-run --model my-main --tenant dev
gateway-cli stats summary
gateway-cli stats by-model
gateway-cli log search --model kimi-k3
gateway-cli --json  # 输出 JSON 便于脚本化
```
