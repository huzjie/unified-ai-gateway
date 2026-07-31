import chalk from 'chalk';

/** 终端颜色（chalk 封装） */
export const colors = {
  cyan: (s: string): string => chalk.cyan(s),
  green: (s: string): string => chalk.green(s),
  yellow: (s: string): string => chalk.yellow(s),
  red: (s: string): string => chalk.red(s),
  bold: (s: string): string => chalk.bold(s),
};
