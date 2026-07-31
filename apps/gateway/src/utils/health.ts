/** 健康摘要 */
export function healthSummary(input: { status: string; uptimeMs: number; version: string; checks?: Record<string, string> }) {
  return {
    status: input.status,
    uptimeMs: input.uptimeMs,
    version: input.version,
    checks: input.checks ?? {},
    ts: new Date().toISOString(),
  };
}
