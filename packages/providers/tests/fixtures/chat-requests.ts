import type { ProviderChatParams } from '@uag/types';

/** 测试用请求夹具 */
export const chatRequests = {
  basic: {
    model: 'mock-all',
    messages: [{ role: 'user' as const, content: 'hello' }],
  },
  withParams: {
    model: 'mock-all',
    messages: [{ role: 'user' as const, content: 'hi' }],
    temperature: 0.5,
    maxTokens: 100,
    stream: false,
  },
  streaming: {
    model: 'mock-all',
    messages: [{ role: 'user' as const, content: 'stream me' }],
    stream: true,
  },
  system: {
    model: 'mock-all',
    messages: [
      { role: 'system' as const, content: 'you are helpful' },
      { role: 'user' as const, content: 'hi' },
    ],
  },
};

export function makeChatParams(overrides: Partial<ProviderChatParams> = {}): ProviderChatParams {
  return {
    model: 'mock-all',
    messages: [{ role: 'user', content: 'test' }],
    ...overrides,
  };
}
