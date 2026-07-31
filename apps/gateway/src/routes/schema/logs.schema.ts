/** logs 请求/响应 JSON Schema */
export const logsSchemas = {
  query: {
    type: 'object',
    properties: {
      keyId: { type: 'string' },
      tenant: { type: 'string' },
      model: { type: 'string' },
      provider: { type: 'string' },
      statusCode: { type: 'integer' },
      search: { type: 'string' },
      startTime: { type: 'string' },
      endTime: { type: 'string' },
      page: { type: 'integer' },
      pageSize: { type: 'integer' },
    },
  },
};
