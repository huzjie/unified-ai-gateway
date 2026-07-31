import { StateMachine } from '../../src/circuit-breaker';

describe('StateMachine', () => {
  it('初始 CLOSED 且可放行', () => {
    const sm = new StateMachine(30000);
    expect(sm.getState()).toBe('CLOSED');
    expect(sm.canAllow()).toBe(true);
  });

  it('open 后进入 OPEN 且不可放行', () => {
    const sm = new StateMachine(30000);
    sm.open();
    expect(sm.getState()).toBe('OPEN');
    expect(sm.canAllow()).toBe(false);
    expect(sm.retryAfterMs).toBeGreaterThan(0);
  });

  it('打开超时自动转 HALF_OPEN', () => {
    let now = 1000;
    const sm = new StateMachine(500, () => now);
    sm.open();
    expect(sm.getState()).toBe('OPEN');
    now += 600;
    expect(sm.getState()).toBe('HALF_OPEN');
    expect(sm.canAllow()).toBe(true);
  });

  it('close 恢复 CLOSED', () => {
    const sm = new StateMachine(30000);
    sm.open();
    sm.close();
    expect(sm.getState()).toBe('CLOSED');
    expect(sm.retryAfterMs).toBe(0);
  });

  it('reset 清空状态', () => {
    const sm = new StateMachine(30000);
    sm.open();
    sm.reset();
    expect(sm.getState()).toBe('CLOSED');
  });

  it('HALF_OPEN 可放行', () => {
    const sm = new StateMachine(30000);
    sm.halfOpen();
    expect(sm.getState()).toBe('HALF_OPEN');
    expect(sm.canAllow()).toBe(true);
  });
});
