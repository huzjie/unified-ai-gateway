/**
 * 假模型/假响应数据
 */
export const mockModels: Record<string, { input: number; output: number; perRequest?: number }> = {
  'mock-chat': { input: 0, output: 0 },
  'mock-stream': { input: 0, output: 0 },
  'mock-all': { input: 0, output: 0 },
};

/** 构造 mock 聊天响应 */
export function mockChatResponse(model: string, content: string): Record<string, unknown> {
  return {
    id: `mockcmpl-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content },
        finish_reason: 'stop',
      },
    ],
    usage: {
      prompt_tokens: 10,
      completion_tokens: content.length,
      total_tokens: 10 + content.length,
    },
  };
}
