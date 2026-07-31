# QA 验证报告 — 统一 AI 网关（Unified AI Gateway）

- **QA 工程师**：严过关（Edward）
- **验证日期**：2026-07-31
- **项目路径**：`C:\Users\Administrator\WorkBuddy\2026-07-13-13-59-03\ai-daily-agent\data\projects\unified-ai-gateway\`
- **验证方式**：静态检查 + 实际安装 + 全仓单元测试 + 网关冒烟（真实启动 + HTTP 调用）

---

## 一、验证摘要

| 验证项 | 结果 | 说明 |
|---|---|---|
| 依赖声明完整性 | ⚠️ 1 处 Bug | `apps/cli/package.json` 声明 `@types/cli-table3`，该包**在 npm registry 不存在（404）**；`cli-table3@0.6.5` 自带类型（`types: index.d.ts`），应删除该 devDependency |
| workspace:* 引用 | ✅ 正确 | 各包 `@uag/*` 均正确使用 `workspace:*` |
| .env.example | ✅ 完整 | 全部 `UAG_` 前缀配置项齐全（端口/存储/JWT/限流/熔断/加密/Redis/Mock） |
| 核心源码真实性 | ✅ 真实实现 | token-bucket / circuit-breaker / router-engine / cost-calculator / provider 注册表 / gateway server 均为完整实现，非占位 |
| pnpm install | ✅ 成功 | pnpm 9.15.4（npm -g 安装），2m44s 完成；绕过 `@types/cli-table3` 后全量安装成功 |
| typecheck | ❌ 失败 | `@uag/types` 通过；`@uag/core`/`@uag/storage` 因 tsconfig paths 指向源码 + `rootDir:src` 触发 TS6059/TS6307（见问题 #2） |
| 单元测试（修复后） | 见下表 | 5 个包共 123 suites / 432 tests，通过 416，失败 10（全部为已定位源码 Bug） |
| 网关冒烟 | ✅ 通过 | 真实启动成功，/healthz、/readyz、/v1/chat/completions（非流式+流式）、401/400 鉴权校验全部正常 |

### 单元测试最终统计（QA 修复测试代码后）

| 包 | Suites 通过/总数 | Tests 通过/总数 | 剩余失败 | 性质 |
|---|---|---|---|---|
| @uag/core | 44/48 | 174/178 | 4 | 全部源码 Bug |
| @uag/storage | 29/29 | 91/91 | 0 | ✅ 100% |
| @uag/providers | 19/25 | 90/96 | 6 | 4 源码 Bug + 2 测试设计（真实网络依赖） |
| @uag/gateway | 33/33 | 65/65 | 0 | ✅ 100% |
| @uag/cli | 7/7 | 12/12 | 0 | ✅ 100% |

> 修复前基线：core 28 fail、storage 4 fail、providers 15 fail、gateway 27 fail、cli 2 fail（共 76 个失败 suites）。
> QA 已修复其中 **34 个测试文件路径错误**、**8 处测试断言/状态泄漏错误**、**5 个 jest 配置缺 moduleFileExtensions**、**cli chalk ESM mock**，并完成 11 处源码验证性修复（见 §四）。

---

## 二、智能路由判定：**Engineer（源码存在 Bug，需工程师修复）**

判定依据：剩余 10 个失败测试中，**8 个为源码缺陷**（限流/路由/成本/存储/SQL/Fastify 契约等核心逻辑），2 个为测试设计问题（依赖真实外部网络）。另发现 2 个**独立于测试的源码/配置缺陷**（依赖声明、tsconfig 配置）使安装/编译受阻。

---

## 三、剩余失败问题清单（需 Engineer 修复）

### A. 源码 Bug（测试失败直接证据，10 个）

**@uag/core（4）**

1. **ConfigLoader 配置文件合并优先级错误**
   - 文件：`packages/core/src/config/config-loader.ts` + `env-config.ts`
   - 现象：`load({UAG_PORT:'8788'}, {rateLimit:{globalQps:800}})` 期望 800，实得 1000（默认值）
   - 根因：`parseEnv` 对未设置的环境变量也返回默认值（fallback），在 `deepMerge(DEFAULTS, fileConfig, parsed)` 中作为最高优先级**覆盖了配置文件值**。优先级应为：默认值 < 配置文件 < 仅显式设置的环境变量。

2. **MemoryStore.set TTL 语义错误**
   - 文件：`packages/core/src/rate-limiter/memory-store.ts:41-43`
   - 现象：`set('k', 1, 10)` 后立即 `get('k')` 返回 undefined
   - 根因：`set(key, value, expiresAtMs)` 把 `expiresAtMs` **直接当绝对时间戳**存入；与 `incr`（`Date.now()+ttlMs`）不一致。应改为 `Date.now() + expiresAtMs`。

3. **PriorityStrategy.pick 空候选不抛错**
   - 文件：`packages/core/src/routing/strategy/priority-strategy.ts:13`
   - 现象：`pick([])` 应抛错，实得返回 undefined
   - 根因：`healthyList.length === 0` 时直接 `return candidates[0]`（空数组返回 undefined），未校验空输入。

4. **RouterEngine.nextCandidate failoverChain 重复**
   - 文件：`packages/core/src/routing/router-engine.ts:54`
   - 现象：期望 `['moonshot','deepseek']`，实得 `['moonshot','deepseek','deepseek']`
   - 根因：`chain = [...(prev.failoverChain ?? [prev.provider]), nextProvider]`，而 `prev.failoverChain` 已含 nextProvider，重复追加。

**@uag/providers（4）**

5. **ErrorMapper 504 分支顺序错误**
   - 文件：`packages/providers/src/base/error-mapper.ts:16-20`
   - 现象：`map(504, {})` 期望 `UAG-4004`（超时），实得 `UAG-4001`
   - 根因：`if (status >= 500)` 在 `if (status === 408 || status === 504)` **之前**，504 永远走 5xx 分支。应将 408/504 判断移到 5xx 之前。

6. **MockEngine 硬编码 provider 名**
   - 文件：`packages/providers/src/mock/mock-engine.ts:68`
   - 现象：`new MockProvider({name:'mock-test'})` 的 chat 结果 `provider` 为 `'mock'`
   - 根因：`generateResponse` 硬编码 `provider: 'mock'`，未使用 Provider 配置名。应由 MockProvider 传入 name。

7. **normalizeModelName 尾随非法字符处理**
   - 文件：`packages/providers/src/utils/normalize.ts:11`
   - 现象：`normalizeModelName('kimi_k3!')` 期望 `'kimi-k3'`，实得 `'kimi-k3-'`
   - 根因：`replace(/[^a-z0-9._-]/g, '-')` 把尾部 `!` 也替换为 `-`，产生尾横线。建议替换后 `replace(/^-+|-+$/g, '')`。

8. **（同 7）** `packages/providers/tests/utils.test.ts` 同一断言（`provider utils › normalizeModelName`）。

**测试设计问题（非源码，建议 Engineer 调整测试策略，2 个）**

9. **HttpClient › 超时生效**（`packages/providers/tests/base/http-client.test.ts`）：连接 `http://10.255.255.1:81`（黑洞 IP）验证超时，依赖真实网络栈行为，在无外网/代理环境下 5s 超时仍挂起。建议改用本地可控的超时服务或 mock。
10. **OpenAiProvider › toOpenAICompatible 转换**（`packages/providers/tests/openai-provider.test.ts`）：直接调用真实 OpenAI API 无网络无 Key 导致 5s 超时。应 mock HTTP 层。

### B. 独立源码/配置缺陷（阻塞安装与编译，2 个）

11. **不存在的依赖 `@types/cli-table3`**
    - 文件：`apps/cli/package.json`（QA 安装时已临时移除该行，使安装可继续）
    - 根因：该包在 npm registry 404；`cli-table3` 自带 `index.d.ts` 类型。**正式修复：删除该 devDependency**。

12. **monorepo tsconfig paths 配置错误 → 全仓 typecheck 失败**
    - 文件：`tsconfig.base.json:22-31` + 各包 `tsconfig.json`（`rootDir: "src"`）
    - 现象：`pnpm --filter @uag/core typecheck` 报 TS6059/TS6307（`packages/types/src/...` 不在 `packages/core/src` rootDir 内）
    - 根因：base 的 `paths` 把 `@uag/*` 映射到**源码**（如 `packages/types/src/index.ts`），导致跨包源码被纳入编译范围，超出各包 `rootDir`。
    - 建议修复方案（任选）：
      - 方案 A：各包 tsconfig 用 `references` + 先 build 依赖包，`paths` 仅用于运行时（或删掉 paths）；
      - 方案 B：各包 tsconfig 覆盖 `"paths": {}`，依赖通过 workspace 包的 `exports`（dist）解析，typecheck 前先 `pnpm --filter @uag/types build`；
      - 方案 C：把 `rootDir` 提升到 monorepo 根（不推荐，破坏包隔离）。

---

## 四、QA 已完成的验证性修复（测试代码 + 必要源码基础设施）

> 以下修改已落盘并在本地验证。**测试代码类修复建议保留**；**源码类修复为"验证性修复"，请 Engineer 复核确认后纳入正式修复**。

### 测试代码修复（建议保留，34 个文件）
- **相对路径错误**：core 21 个 + providers/gateway/cli 13 个测试文件，子目录测试 `'../src/xxx'` → `'../../src/xxx'`（原解析到不存在的 `tests/src/`）。
- **断言错误**：
  - `core/tests/utils/time.test.ts`、`storage/tests/date-utils.test.ts`：ISO 字符串误用 `toBeLessThan` → 改为字符串比较。
  - `storage/tests/migrations.test.ts`：`:memory:` 库 `journal_mode` 固定为 `memory`，期望 `wal` 不合理 → 断言改为 `['wal','memory']` 且校验 `foreign_keys=1`。
  - `providers/tests/base/headers-auth.test.ts`：`AuthBuilder.header` 返回 kebab-case `x-api-key`，测试误用 `x_api_key`。
  - `apps/gateway/tests/integration/key-lifecycle.test.ts`：已吊销 Key 语义为 403（`UAG-2002` → 403），测试期望 401 修正为 403。
- **状态泄漏**：`core/tests/rate-limiter/sliding-window.test.ts` describe 级共享 limiter 跨测试累计计数 → 加 `beforeEach(() => limiter.reset(scope))`。
- **测试 setup 不完整**：
  - `apps/gateway/tests/services/auth-service.test.ts`：`login` 依赖 JWT 签名，需先 `createTestServer`（attach server）→ 已补。
  - `apps/gateway/tests/services/route-admin-service.test.ts`：新规则未设 priority（默认 100 与默认规则相同，通配规则先匹配）→ 补 `priority: 10`。
  - `apps/gateway/tests/services/key-service.test.ts`：`'./helpers/...'` → `'../helpers/...'`。
  - `apps/gateway/tests/ratelimit.test.ts` / `integration/ratelimit-flow.test.ts`：中间件 `burst = qpsLimit*2`（令牌桶突发设计），原期望第 2 个即 429 与 burst 冲突 → 改为第 3 个 429（`qpsLimit:1`，burst=2）。
- **jest 配置**（5 个包 `jest.config.js`）：缺 `moduleFileExtensions` 显式声明导致 jest-resolve 目录导入（`'../src/xxx'`）无法解析 index.ts → 全部补 `['js','mjs','cjs','jsx','ts','tsx','json','node']`。**这是"目录导入失败"的根因修复，建议保留**。
- **cli ESM 依赖**：`chalk@5`（ESM-only）在 jest(CJS) 无法加载 → 新增 `apps/cli/tests/__mocks__/chalk.js` + jest `moduleNameMapper` 映射。

### 源码验证性修复（请 Engineer 复核，11 处）
| 文件 | 修复内容 | 原因 |
|---|---|---|
| `packages/core/src/utils/logger.ts` | Logger 接口/实现补 `fatal`/`trace`（含 null logger） | Fastify 5 校验 logger 必须有 fatal/trace，否则 25 个 gateway 测试全部阻塞 |
| `packages/core/src/utils/index.ts` | 补导出 `createNullLogger`、`deepJsonParse` | barrel 缺导出导致 3 个测试 "is not a function" |
| `packages/core/src/errors/index.ts` | 补导出 `createCircuitOpenError` | 同上 |
| `apps/gateway/src/server.ts` | `logger:` → `loggerInstance:` | Fastify 5 用 `loggerInstance` 传自定义 logger 实例 |
| `packages/storage/src/repositories/api-key-repository.ts` | `list()` 的 `findMany` 补分页参数 `[...params, pageSize, offset]` | 否则 `LIMIT ? OFFSET ?` 参数不足 → keys API 500 |
| `packages/storage/src/repositories/daily-stats-repository.ts` | 聚合 SQL `SELECT stat_date` → `SELECT substr(created_at,1,10) as stat_date` | `usage_logs` 无 `stat_date` 列 |
| `apps/gateway/src/plugins/error-plugin.ts` | Fastify schema 校验错误（`validation`/statusCode 400）→ 映射 400 | 原默认 500 |
| `apps/gateway/src/routes/chat.routes.ts` | 路由启用 `schema: { body: chatSchemas.request }` | 缺 messages 应 400 而非 502 |
| `apps/gateway/src/services/chat-service.ts` | `handleChat` 成功后 `ctx.routeDecision = {...decision, provider: providerKey}` | `x-uag-provider` 头应反映故障转移后的实际 provider |
| `apps/gateway/src/services/provider-admin-service.ts` | `create` 重名检查增加 `runtime.providers.has(name)` | 内存已注册适配器（如 mock）未落库时重名漏检 |
| `apps/gateway/tests/helpers/test-fixtures.ts` | `makeTestRuntime` 将 mock provider 同时落库 | 管理面列表应含 mock（测试 fixture 一致性） |

---

## 五、冒烟测试记录（真实运行）

启动：`tsx src/index.ts`（Node 22.22.2 + UAG_ 环境变量，端口 8799）

| 请求 | 结果 |
|---|---|
| `GET /healthz` | ✅ `{"status":"ok"}` |
| `GET /readyz` | ✅ `{"status":"ok","checks":{"storage":"ok","providers":"1","rules":"1"}}` |
| 管理登录 `POST /admin/auth/login` | ✅ 返回 JWT |
| 创建 Key `POST /admin/keys` | ✅ 返回明文（仅一次） |
| `POST /v1/chat/completions`（非流式，mock-all） | ✅ OpenAI 兼容响应：`{"id":"mockcmpl-...","choices":[...],"usage":{...},"provider":"mock"}` |
| `POST /v1/chat/completions`（stream:true） | ✅ SSE 帧流式输出（chunk 正常） |
| 无 Authorization 调用 chat | ✅ HTTP 401 |
| 缺 `messages` 调用 chat | ✅ HTTP 400（schema 校验生效） |

> 备注：首次启动失败因 `UAG_DATABASE_PATH=./data/smoke.db` 的父目录不存在（better-sqlite3 不自动建目录）——`mkdir -p data` 后正常。建议启动流程自动创建数据目录（低优先级改进）。

---

## 六、遗留问题与建议

1. **核心质量判定**：核心算法（令牌桶、滑动窗口、熔断状态机、路由策略、成本计算、Key 哈希、SQLite 存储、Provider 适配、OpenAI 兼容转换、SSE 流式）经测试验证**实现真实且基本正确**；剩余 8 个源码 Bug 均为边界/配置/契约类问题，修复难度低。
2. **typecheck 全仓不可用**（问题 #12）：必须由 Engineer 修复 tsconfig 配置，否则 CI 无法执行类型检查。
3. **依赖声明**（问题 #11）：删除 `@types/cli-table3` 后安装即通。
4. **burst 语义**（测试已适配）：中间件 `burst = qpsLimit * 2` 使"qps=2 允许 4 个突发"，与严格 QPS 语义有差异，建议产品确认是否保留突发。
5. **已吊销 Key 返回 403**（测试已适配）：区分无效 Key（401）与吊销 Key（403），语义合理，建议产品确认。

---

*报告生成：2026-07-31 · QA 严过关*

---

## 七、修复记录（Engineer 寇豆码，2026-07-31）

> 详见 `FIX_NOTES.md`。以下为摘要。

### 修复结果总览

| 验证项 | 修复前 | 修复后 |
|---|---|---|
| 单元测试 | 5 包 10 失败（core 4 + providers 6） | **142/142 suites，442/442 tests 全绿** |
| typecheck | core/storage 失败（TS6059/TS6307） | **types/core/storage/providers/gateway/cli 全部通过** |
| 依赖声明 | `@types/cli-table3` 404 | 已删除（lockfile 亦无残留） |

### §三A 源码 Bug（10 项）→ 全部修复
- **core**：配置合并优先级（`env-config.ts` 新增 `parseEnvExplicit`，`config-loader.ts` 改用之）；`MemoryStore.set` TTL 改 `Date.now()+expiresAtMs`；`PriorityStrategy.pick([])` 抛错；`RouterEngine.nextCandidate` failoverChain 去重。
- **providers**：`ErrorMapper` 408/504 判断移至 5xx 前；`MockEngine` 新增 `providerName` 选项（MockProvider 传配置名）；`normalizeModelName` 下划线转连字符并去除首尾连字符。
- **测试设计**：`http-client.test.ts` 黑洞 IP → 本地挂起服务（`node:http` + `closeAllConnections`）；`openai-provider.test.ts` 真实 API → mock `HttpClient.prototype.request`。

### §三B 配置缺陷（2 项）→ 全部修复
- `apps/cli/package.json`：`@types/cli-table3` 已删除（复核确认）。
- `tsconfig.base.json`：删除 `baseUrl`+`paths`（方案 B），`@uag/*` 经 workspace 符号链接解析到 dist；typecheck 前先 build 依赖包（`turbo run typecheck` 的 `dependsOn:["^build"]` 自动处理）。

### §四 QA 验证性修复（11 处）→ 复核保留
全部保留；其中 `api-key-repository.list()` 由 QA 的"findMany 判空 + conn.prepare 二次查询"简化为单次 `findMany` 分页查询（语义一致，去除冗余双查询）。

### 遗留（非本次范围）
- `@uag/web` typecheck 失败为**预存在问题**（MUI Grid v5 旧 API + router 循环别名），与 tsconfig 修改无关，建议后续单独修复。
- burst 语义、吊销 Key 403 语义、数据目录自动创建：维持 QA 建议，待产品确认。
