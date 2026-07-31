/** 分页/错误响应公共 Schema */
export const commonSchemas = {
  page: {
    type: 'object',
    properties: {
      page: { type: 'integer', minimum: 1, default: 1 },
      pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
    },
  },
  pageResult: {
    type: 'object',
    properties: {
      items: { type: 'array' },
      total: { type: 'integer' },
      page: { type: 'integer' },
      pageSize: { type: 'integer' },
      totalPages: { type: 'integer' },
    },
  },
  error: {
    type: 'object',
    properties: {
      code: { type: 'string' },
      message: { type: 'string' },
    },
  },
  apiResponse: {
    type: 'object',
    properties: {
      code: { type: ['integer', 'string'] },
      data: {},
      message: { type: 'string' },
    },
  },
};
