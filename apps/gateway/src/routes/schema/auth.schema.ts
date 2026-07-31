/** auth 请求/响应 JSON Schema */
export const authSchemas = {
  login: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
    },
  },
  loginResponse: {
    type: 'object',
    properties: {
      code: { type: 'integer' },
      data: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          expiresAt: { type: 'string' },
          user: { type: 'object' },
        },
      },
      message: { type: 'string' },
    },
  },
};
