import type { GatewayEventType } from '@uag/types';
import { EventBus, type EventHandler } from './event-bus';

/**
 * 订阅器工具：便捷订阅并返回取消函数集合
 */
export class EventSubscriber {
  private readonly unsubscribers: Array<() => void> = [];

  constructor(private readonly bus: EventBus) {}

  /** 订阅并记录取消函数 */
  on<T = unknown>(type: GatewayEventType | GatewayEventType[], handler: EventHandler<T>, options?: { async?: boolean }): this {
    this.unsubscribers.push(this.bus.subscribe(type, handler, options));
    return this;
  }

  /** 取消全部订阅 */
  unsubscribeAll(): void {
    for (const unsub of this.unsubscribers) {
      unsub();
    }
    this.unsubscribers.length = 0;
  }
}
