/** chat 请求/响应 JSON Schema */
export const chatSchemas = {
  request: {
    type: 'object',
    required: ['model', 'messages'],
    properties: {
      model: { type: 'string' },
      messages: { type: 'array', items: { type: 'object' } },
      temperature: { type: 'number' },
      top_p: { type: 'number' },
      max_tokens: { type: 'integer' },
      stream: { type: 'boolean' },
      stop: { anyOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
    },
  },
  response: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      object: { type: 'string' },
      created: { type: 'integer' },
      model: { type: 'string' },
      choices: { type: 'array' },
      usage: { type: 'object' },
    },
  },
};
