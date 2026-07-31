/** routes 请求/响应 JSON Schema */
export const routesSchemas = {
  create: {
    type: 'object',
    required: ['name', 'targets'],
    properties: {
      name: { type: 'string' },
      priority: { type: 'integer' },
      matchModel: { type: ['string', 'null'] },
      matchTenant: { type: ['string', 'null'] },
      strategy: { type: 'string', enum: ['priority', 'failover', 'cost-first', 'random'] },
      targets: { type: 'array', items: { type: 'string' }, minItems: 1 },
      fallbackTargets: { type: 'array', items: { type: 'string' } },
      breakerThreshold: { type: 'number' },
      enabled: { type: 'boolean' },
    },
  },
  update: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      priority: { type: 'integer' },
      matchModel: { type: ['string', 'null'] },
      matchTenant: { type: ['string', 'null'] },
      strategy: { type: 'string' },
      targets: { type: 'array', items: { type: 'string' } },
      fallbackTargets: { type: 'array', items: { type: 'string' } },
      breakerThreshold: { type: 'number' },
      enabled: { type: 'boolean' },
    },
  },
};
