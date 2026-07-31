/** stats 请求/响应 JSON Schema */
export const statsSchemas = {
  query: {
    type: 'object',
    properties: {
      dimension: { type: 'string', enum: ['model', 'key', 'provider', 'date'] },
      model: { type: 'string' },
      provider: { type: 'string' },
      tenant: { type: 'string' },
      startTime: { type: 'string' },
      endTime: { type: 'string' },
    },
  },
};
