/**
 * 熔断 Key 解析（provider 或 provider:model）
 */
export function resolveBreakerKey(provider: string, model?: string): string {
  return model ? `${provider}:${model}` : provider;
}
