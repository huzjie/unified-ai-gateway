/** 测试用错误夹具 */
export const errors = {
  upstream500: { error: { message: 'Internal Server Error', type: 'server_error' } },
  rateLimited: { error: { message: 'Rate limit exceeded', type: 'rate_limit_error' } },
  authFailed: { error: { message: 'Invalid API key', type: 'authentication_error' } },
  timeoutMessage: 'socket timed out after 30000ms',
  connectionRefused: 'connect ECONNREFUSED 127.0.0.1:11434',
};
