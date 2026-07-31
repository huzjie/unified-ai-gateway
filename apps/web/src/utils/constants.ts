/** 常量 */
export const ROUTES = {
  dashboard: '/',
  keys: '/keys',
  providers: '/providers',
  routes: '/routes',
  logs: '/logs',
  settings: '/settings',
  audit: '/audit',
  export: '/export',
} as const;

export const PROVIDER_TYPES = ['openai', 'moonshot', 'deepseek', 'minimax', 'anthropic', 'ollama', 'mock'] as const;
