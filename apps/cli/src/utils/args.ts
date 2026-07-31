/** 公共参数解析 */
export interface CommonArgs {
  json: boolean;
  apiUrl: string;
  token?: string;
}

export function parseCommonArgs(argv: string[]): CommonArgs {
  const json = argv.includes('--json');
  const apiUrlIdx = argv.indexOf('--api-url');
  const apiUrl = apiUrlIdx >= 0 ? argv[apiUrlIdx + 1] : 'http://localhost:8787';
  const tokenIdx = argv.indexOf('--token');
  const token = tokenIdx >= 0 ? argv[tokenIdx + 1] : undefined;
  return { json, apiUrl, token };
}
