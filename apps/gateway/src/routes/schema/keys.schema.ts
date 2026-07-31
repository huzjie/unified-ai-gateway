/** keys 请求/响应 JSON Schema */
export const keysSchemas = {
  create: {
    type: 'object',
    required: ['name', 'tenant'],
    properties: {
      name: { type: 'string' },
      tenant: { type: 'string' },
      modelWhitelist: { type: 'array', items: { type: 'string' } },
      qpsLimit: { type: 'integer' },
      concurrencyLimit: { type: 'integer' },
      monthlyQuotaTokens: { type: 'integer' },
      monthlyQuotaAmount: { type: 'number' },
      expiresAt: { type: 'string' },
    },
  },
  update: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      modelWhitelist: { type: 'array', items: { type: 'string' } },
      qpsLimit: { type: 'integer' },
      concurrencyLimit: { type: 'integer' },
      expiresAt: { type: ['string', 'null'] },
    },
  },
};
