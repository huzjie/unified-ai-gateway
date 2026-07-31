/** 测试用响应夹具 */
export const chatResponses = {
  openaiCompatible: {
    id: 'chatcmpl-1',
    object: 'chat.completion',
    created: 1750000000,
    model: 'gpt-4o',
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content: 'Hello!' },
        finish_reason: 'stop',
      },
    ],
    usage: { prompt_tokens: 10, completion_tokens: 2, total_tokens: 12 },
  },
  anthropicMessages: {
    id: 'msg_1',
    model: 'claude-3-5-sonnet',
    content: [{ type: 'text', text: 'Hi!' }],
    usage: { input_tokens: 10, output_tokens: 2 },
  },
  ollamaChat: {
    model: 'llama3.1',
    message: { role: 'assistant', content: 'Hi!' },
    done: true,
  },
  error: {
    error: { message: 'invalid api key', type: 'authentication_error', code: 'invalid_api_key' },
  },
};
