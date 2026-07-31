/** providers 请求/响应 JSON Schema */
export const providersSchemas = {
  create: {
    type: 'object',
    required: ['name', 'type', 'baseUrl'],
    properties: {
      name: { type: 'string' },
      type: { type: 'string', enum: ['openai', 'moonshot', 'deepseek', 'minimax', 'anthropic', 'ollama', 'mock'] },
      baseUrl: { type: 'string' },
      apiKey: { type: 'string' },
      models: { type: 'array', items: { type: 'string' } },
      pricing: { type: 'object' },
      timeoutMs: { type: 'integer' },
      maxRetries: { type: 'integer' },
      enabled: { type: 'string', enum: ['enabled', 'disabled'] },
    },
  },
  update: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      baseUrl: { type: 'string' },
      apiKey: { type: 'string' },
      models: { type: 'array', items: { type: 'string' } },
      timeoutMs: { type: 'integer' },
      maxRetries: { type: 'integer' },
      enabled: { type: 'string', enum: ['enabled', 'disabled'] },
    },
  },
};
