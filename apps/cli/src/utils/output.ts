import chalk from 'chalk';

/**
 * JSON/表格/纯文本输出（可脚本化）
 */
class Output {
  /** 是否 JSON 输出模式 */
  isJson = false;

  setJsonMode(flag: boolean): void {
    this.isJson = flag;
  }

  json(data: unknown): void {
    process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
  }

  info(msg: string): void {
    if (!this.isJson) process.stdout.write(`${chalk.blue('[info]')} ${msg}\n`);
  }

  success(msg: string): void {
    if (!this.isJson) process.stdout.write(`${chalk.green('[ok]')} ${msg}\n`);
  }

  warn(msg: string): void {
    if (!this.isJson) process.stdout.write(`${chalk.yellow('[warn]')} ${msg}\n`);
  }

  error(msg: string): void {
    process.stderr.write(`${chalk.red('[error]')} ${msg}\n`);
  }
}

export const output = new Output();
