import { BreakerRegistry } from '../../src/circuit-breaker';
import { ErrorCode } from '@uag/types';

describe('BreakerRegistry', () => {
  it('按 providerKey 管理独立熔断器', () => {
    const registry = new BreakerRegistry({ failureThreshold: 0.5, minRequests: 1, openMs: 100000 });
    for (let i = 0; i < 3; i++) {
      registry.recordFailure('bad');
    }
    expect(registry.getState('bad')).toBe('OPEN');
    expect(registry.getState('good')).toBe('CLOSED');
  });

  it('reset 与 resetAll', () => {
    const registry = new BreakerRegistry({ failureThreshold: 0.5, minRequests: 1, openMs: 100000 });
    registry.recordFailure('a');
    registry.recordFailure('a');
    registry.reset('a');
    expect(registry.getState('a')).toBe('CLOSED');
    registry.recordFailure('b');
    registry.recordFailure('b');
    registry.resetAll();
    expect(registry.getState('b')).toBe('CLOSED');
  });

  it('snapshots 与 size', () => {
    const registry = new BreakerRegistry();
    registry.allow('x');
    expect(registry.size).toBe(1);
    expect(registry.snapshots()[0].providerKey).toBe('x');
  });

  it('连续失败触发', () => {
    const registry = new BreakerRegistry({ consecutiveFailures: 3, failureThreshold: 1, minRequests: 100, openMs: 100000 });
    registry.recordFailure('c');
    registry.recordFailure('c');
    registry.recordFailure('c');
    expect(registry.getState('c')).toBe('OPEN');
  });
});
