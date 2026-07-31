import type { GatewayEventType } from '@uag/types';

/** 事件名常量 */
export const EVENT_TYPES: Record<string, GatewayEventType> = {
  REQUEST_STARTED: 'request_started',
  REQUEST_COMPLETED: 'request_completed',
  USAGE_RECORDED: 'usage_recorded',
  RATE_LIMITED: 'rate_limited',
  CIRCUIT_OPENED: 'circuit_opened',
  CIRCUIT_CLOSED: 'circuit_closed',
  CIRCUIT_HALF_OPEN: 'circuit_half_open',
  PROVIDER_FAILED: 'provider_failed',
  PROVIDER_RECOVERED: 'provider_recovered',
  AUDIT_LOGGED: 'audit_logged',
  QUOTA_EXCEEDED: 'quota_exceeded',
  CACHE_HIT: 'cache_hit',
  CACHE_MISS: 'cache_miss',
};

export type { GatewayEventType };
export type EventHandler<T = unknown> = (event: import('@uag/types').GatewayEvent<T>) => void | Promise<void>;
