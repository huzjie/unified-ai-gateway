import type { RuntimeRegistry } from '../services/runtime-registry';

/** chat 编排（非流式/流式分流） */
export class ChatController {
  constructor(_runtime: RuntimeRegistry) {}

  /** 处理 chat 请求体 */
  async handle(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    // 由路由层直接调用 service；此处提供面向测试的便捷入口
    return body;
  }
}
