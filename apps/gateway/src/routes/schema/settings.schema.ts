/** settings 请求/响应 JSON Schema */
export const settingsSchemas = {
  update: {
    type: 'object',
    properties: {
      defaultTimeoutMs: { type: 'integer' },
      defaultMaxRetries: { type: 'integer' },
      breakerFailureThreshold: { type: 'number' },
      breakerMinRequests: { type: 'integer' },
      breakerOpenMs: { type: 'integer' },
      globalQps: { type: 'integer' },
      globalConcurrency: { type: 'integer' },
      webhookUrl: { type: ['string', 'null'] },
      alertRateLimited: { type: 'boolean' },
      alertCircuitOpen: { type: 'boolean' },
      alertQuotaExceeded: { type: 'boolean' },
      logRetentionDays: { type: 'integer' },
      cacheEnabled: { type: 'boolean' },
    },
  },
};
