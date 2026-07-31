import { createNullLogger, createLogger } from '../../src/utils/logger';

describe('logger', () => {
  it('null logger 安全', () => {
    const logger = createNullLogger();
    expect(() => {
      logger.info('x');
      logger.debug({ a: 1 }, 'y');
      logger.warn('z');
      logger.error('e');
      logger.child({ module: 'm' }).info('c');
    }).not.toThrow();
  });

  it('createLogger 输出 JSON', () => {
    const spy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const logger = createLogger({ level: 'info' });
    logger.info({ module: 'test', msg: 'hello' }, 'hello');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
