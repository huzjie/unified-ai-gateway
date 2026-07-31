# 修复记录（Engineer 复核 + 修复）

- **工程师**：寇豆码（Kou）
- **修复日期**：2026-07-31
- **依据**：QA_REPORT.md §三（剩余问题清单）+ §四（QA 验证性修复复核）

---

## 一、源码 Bug 修复（§三A，10 项）

### @uag/core（4 项）

| # | 文件 | 修复内容 |
|---|---|---|
| 1 | `packages/core/src/config/env-config.ts` | 新增 `parseEnvExplicit(env): Partial<ParsedEnv>`，仅解析显式设置的环境变量（未设置/空值不产生字段，空 `UAG_REDIS_URL` 显式映射为 `null`） |
| 1 | `packages/core/src/config/config-loader.ts` | `load()` 改用 `parseEnvExplicit` 参与 `deepMerge(DEFAULTS, fileConfig, parsed)`，优先级修正为 **默认值 < 配置文件 < 仅显式设置的环境变量**；`parseEnv`（含默认值版本）保留供独立使用 |
| 2 | `packages/core/src/rate-limiter/memory-store.ts` | `set(key, value, expiresAtMs)` 改为 `expiresAt: expiresAtMs ? Date.now() + expiresAtMs : null`，与 `incr` 的 TTL 语义一致 |
| 2 | `packages/core/tests/rate-limiter/memory-store.test.ts` | TTL 清理测试改用 `jest.useFakeTimers()` + `advanceTimersByTime(11)`，消除真实时间竞争（修复后 `prune()` 立即执行不再必然过期） |
| 3 | `packages/core/src/routing/strategy/priority-strategy.ts` | `pick([])` 空候选显式抛错；全部不健康时仍回退 `candidates[0]`（与既有测试一致） |
| 4 | `packages/core/src/routing/router-engine.ts` | `nextCandidate` 追加 failoverChain 前先判断末位是否已为 `nextProvider`，避免重复（`['moonshot','deepseek']` 不再变成 `['moonshot','deepseek','deepseek']`） |

### @uag/providers（4 项）

| # | 文件 | 修复内容 |
|---|---|---|
| 5 | `packages/providers/src/base/error-mapper.ts` | `408/504 → UAG-4004（超时）` 判断移到 `status >= 500` 之前，504 不再落入 `UAG-4001` |
| 6 | `packages/providers/src/mock/mock-engine.ts` | `MockEngineOptions` 新增 `providerName`（默认 `'mock'`）；`generateResponse` 返回 `provider: this.options.providerName` |
| 6 | `packages/providers/src/mock/mock-provider.ts` | 构造引擎时传入 `providerName: config.name`（Provider 配置名优先，覆盖 options 默认值） |
| 7 | `packages/providers/src/utils/normalize.ts` | `normalizeModelName` 下划线/非法字符统一转连字符 `[^a-z0-9.-]`，并 `replace(/^-+\|-+$/g, '')` 去除首尾连字符（`'kimi_k3!' → 'kimi-k3'`） |
| 8 | `packages/providers/tests/utils.test.ts` / `normalize.test.ts` | 断言本身已正确（期望 `'kimi-k3'`），无需改动，源码修复后自动通过 |

### 测试设计问题（2 项）

| # | 文件 | 修复内容 |
|---|---|---|
| 9 | `packages/providers/tests/base/http-client.test.ts` | 弃用真实黑洞 IP `10.255.255.1:81`；改为 `node:http` 本地"挂起"服务（接受连接不响应），`beforeAll` 启动随机端口、`afterAll` 用 `closeAllConnections()` 强制销毁 undici 残留 keep-alive 连接，确定性触发 100ms 超时，不再依赖外网/代理 |
| 10 | `packages/providers/tests/openai-provider.test.ts` | 不再直连真实 OpenAI API；`jest.spyOn(HttpClient.prototype, 'request')` mock HTTP 层返回固定 OpenAI 兼容响应，验证 `chat → toOpenAICompatible` 全链路 |

## 二、配置缺陷修复（§三B，2 项）

| # | 文件 | 修复内容 |
|---|---|---|
| 11 | `apps/cli/package.json` | 确认 `@types/cli-table3` 已移除（QA 安装时已删，本次复核无残留；`pnpm-lock.yaml` 亦无 `@types/cli-table3` 引用）。`cli-table3@0.6.5` 自带 `index.d.ts` |
| 12 | `tsconfig.base.json` | 删除 `baseUrl` + `paths`（原映射到各包源码 `src/index.ts`，与各包 `rootDir:src` 冲突触发 TS6059/TS6307）。`@uag/*` 现通过 pnpm workspace 符号链接解析到各包 `exports`/`types`（dist），**typecheck 前需先 build 依赖包**（`turbo run typecheck` 已通过 `dependsOn:["^build"]` 自动处理） |

## 三、QA 验证性源码修复复核（§四，11 处）

| 文件 | QA 修复 | 复核结论 |
|---|---|---|
| `packages/core/src/utils/logger.ts` | Logger 接口/实现补 `fatal`/`trace`（含 null logger） | ✅ 保留（Fastify 5 logger 契约必需） |
| `packages/core/src/utils/index.ts` | 补导出 `createNullLogger`、`deepJsonParse` | ✅ 保留（barrel 导出齐全） |
| `packages/core/src/errors/index.ts` | 补导出 `createCircuitOpenError` | ✅ 保留（`error-factory.ts:39` 确有此实现） |
| `apps/gateway/src/server.ts` | `logger:` → `loggerInstance:` | ✅ 保留（Fastify 5 自定义 logger 实例契约） |
| `packages/storage/src/repositories/api-key-repository.ts` | `list()` 补分页参数 | ✅ 保留并**简化**：QA 原实现先 `findMany` 判空再 `conn.prepare` 二次查询；已收敛为单次 `findMany(where, [...params, pageSize, offset], 'ORDER BY ... LIMIT ? OFFSET ?')`，语义不变 |
| `packages/storage/src/repositories/daily-stats-repository.ts` | 聚合 SQL `stat_date` → `substr(created_at,1,10)` | ✅ 保留（`usage_logs` 无 `stat_date` 列） |
| `apps/gateway/src/plugins/error-plugin.ts` | schema 校验错误 → 400 | ✅ 保留 |
| `apps/gateway/src/routes/chat.routes.ts` | 路由启用 `schema:{body:chatSchemas.request}` | ✅ 保留（缺 messages 应 400） |
| `apps/gateway/src/services/chat-service.ts` | 成功后 `ctx.routeDecision = {...decision, provider: providerKey}` | ✅ 保留（`x-uag-provider` 反映故障转移后的实际 provider） |
| `apps/gateway/src/services/provider-admin-service.ts` | `create` 重名检查加 `runtime.providers.has(name)` | ✅ 保留 |
| `apps/gateway/tests/helpers/test-fixtures.ts` | mock provider 同时落库 | ✅ 保留（管理面列表一致性） |

> 说明：QA 报告 §四 中 34 个测试文件路径/断言/jest 配置修复均保留，未回退。

## 四、验证结果

### 单元测试（全部通过）

| 包 | Suites | Tests | 结果 |
|---|---|---|---|
| @uag/core | 48/48 | 178/178 | ✅ 100% |
| @uag/storage | 29/29 | 91/91 | ✅ 100% |
| @uag/providers | 25/25 | 96/96 | ✅ 100% |
| @uag/gateway | 33/33 | 65/65 | ✅ 100% |
| @uag/cli | 7/7 | 12/12 | ✅ 100% |
| **合计** | **142/142** | **442/442** | ✅ 100% |

修复前：5 包共 10 个失败测试（core 4、providers 6）。修复后全绿。

### typecheck（全部通过）

| 包 | 结果 |
|---|---|
| @uag/types | ✅ |
| @uag/core | ✅ |
| @uag/storage | ✅ |
| @uag/providers | ✅ |
| @uag/gateway | ✅ |
| @uag/cli | ✅ |

执行方式：`tsconfig.base.json` 移除 paths 后，先按依赖顺序 build（types → core → storage → providers → gateway/cli），再运行各包 `typecheck`。

### 构建

`pnpm --filter @uag/{types,core,storage,providers} build`、`pnpm --filter @uag/gateway build`、`pnpm --filter @uag/cli build` 全部成功。

## 五、遗留说明（非本次修复范围）

1. **@uag/web typecheck 失败（预存在问题）**：`apps/web/src/pages/RoutesPage.tsx` 使用 MUI v5 Grid 旧 API（`xs/md`），当前 MUI v6 要求 `size`；`apps/web/src/router/index.ts` 存在 `TS2303 Circular definition of import alias 'AppRouter'`。与本次 tsconfig 修改无关（无任何 `@uag/*` 解析错误），属前端页面独立问题，建议后续单独修复。
2. **burst 语义**（QA §六.4）：中间件 `burst = qpsLimit*2` 允许突发，产品需确认是否保留（测试已适配）。
3. **已吊销 Key 返回 403**（QA §六.5）：区分无效 Key（401）与吊销 Key（403），语义合理，产品可确认。
4. **数据目录自动创建**（QA §五备注）：`better-sqlite3` 不自动建父目录，建议启动流程 `mkdir -p data`（低优先级改进，未改）。
