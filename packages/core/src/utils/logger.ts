import pino, { type Logger as PinoLogger, type LoggerOptions } from 'pino';

/** 日志器接口（pino 封装，含 Fastify 契约所需的 fatal/trace） */
export interface Logger {
  fatal(obj: unknown, msg?: string): void;
  fatal(msg: string): void;
  error(obj: unknown, msg?: string): void;
  error(msg: string): void;
  warn(obj: unknown, msg?: string): void;
  warn(msg: string): void;
  info(obj: unknown, msg?: string): void;
  info(msg: string): void;
  debug(obj: unknown, msg?: string): void;
  debug(msg: string): void;
  trace(obj: unknown, msg?: string): void;
  trace(msg: string): void;
  child(bindings: Record<string, unknown>): Logger;
}

function toPinoStyle(bindings: unknown, msg?: string): [unknown, string] {
  if (typeof bindings === 'string') {
    return [msg ?? '', bindings];
  }
  return [bindings, msg ?? ''];
}

/** 创建 pino 日志器（JSON Lines） */
export function createLogger(options: { level?: string; pretty?: boolean; base?: Record<string, unknown> } = {}): Logger {
  const opts: LoggerOptions = {
    level: options.level ?? 'info',
    base: options.base ?? { service: 'unified-ai-gateway' },
    timestamp: () => `,"ts":"${new Date().toISOString()}"`,
    messageKey: 'msg',
  };
  const pinoLogger: PinoLogger = pino(opts);

  const wrap = (logger: PinoLogger): Logger => {
    // pino 重载类型较复杂，使用类型断言绕过重载差异
    const pinoLoggerRaw = logger as unknown as {
      fatal: (a: unknown, b?: unknown) => void;
      error: (a: unknown, b?: unknown) => void;
      warn: (a: unknown, b?: unknown) => void;
      info: (a: unknown, b?: unknown) => void;
      debug: (a: unknown, b?: unknown) => void;
      trace: (a: unknown, b?: unknown) => void;
      child: (b: Record<string, unknown>) => PinoLogger;
    };
    return {
      fatal: (bindings: unknown, msg?: string) => {
        const [a, b] = toPinoStyle(bindings, msg);
        pinoLoggerRaw.fatal(a, b);
      },
      error: (bindings: unknown, msg?: string) => {
        const [a, b] = toPinoStyle(bindings, msg);
        pinoLoggerRaw.error(a, b);
      },
      warn: (bindings: unknown, msg?: string) => {
        const [a, b] = toPinoStyle(bindings, msg);
        pinoLoggerRaw.warn(a, b);
      },
      info: (bindings: unknown, msg?: string) => {
        const [a, b] = toPinoStyle(bindings, msg);
        pinoLoggerRaw.info(a, b);
      },
      debug: (bindings: unknown, msg?: string) => {
        const [a, b] = toPinoStyle(bindings, msg);
        pinoLoggerRaw.debug(a, b);
      },
      trace: (bindings: unknown, msg?: string) => {
        const [a, b] = toPinoStyle(bindings, msg);
        pinoLoggerRaw.trace(a, b);
      },
      child: (bindings: Record<string, unknown>) => wrap(pinoLoggerRaw.child(bindings)),
    };
  };

  return wrap(pinoLogger);
}

/** 无操作日志器（测试用） */
export function createNullLogger(): Logger {
  return {
    fatal: () => undefined,
    error: () => undefined,
    warn: () => undefined,
    info: () => undefined,
    debug: () => undefined,
    trace: () => undefined,
    child: () => createNullLogger(),
  };
}
