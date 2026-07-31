/** 简易日志器 */
export const logger = {
  debug: (msg: string): void => {
    if (process.env.GATEWAY_CLI_DEBUG === '1') {
      process.stderr.write(`[debug] ${msg}\n`);
    }
  },
  info: (msg: string): void => {
    process.stdout.write(`${msg}\n`);
  },
  error: (msg: string): void => {
    process.stderr.write(`[error] ${msg}\n`);
  },
};
