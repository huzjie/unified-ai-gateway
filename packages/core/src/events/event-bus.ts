import type { GatewayEvent, GatewayEventType } from '@uag/types';
import { uuid } from '../utils/id';

/** 事件处理器 */
export type EventHandler<T = unknown> = (event: GatewayEvent<T>) => void | Promise<void>;

/** 订阅注册项 */
interface Subscription {
  handler: EventHandler;
  async: boolean;
}

/**
 * 进程内事件总线（同步 + 异步投递）
 * 核心无副作用：发布事件，由 listener 落库/推送。
 */
export class EventBus {
  private readonly subscriptions = new Map<GatewayEventType, Subscription[]>();
  private readonly wildcard: Subscription[] = [];

  /** 订阅事件（async=true 时异步投递不阻塞发布者） */
  subscribe<T = unknown>(type: GatewayEventType | GatewayEventType[], handler: EventHandler<T>, options: { async?: boolean } = {}): () => void {
    const sub: Subscription = { handler: handler as EventHandler, async: options.async ?? false };
    const types = Array.isArray(type) ? type : [type];
    for (const t of types) {
      const list = this.subscriptions.get(t) ?? [];
      list.push(sub);
      this.subscriptions.set(t, list);
    }
    return () => {
      for (const t of types) {
        const list = this.subscriptions.get(t);
        if (list) {
          const idx = list.indexOf(sub);
          if (idx >= 0) {
            list.splice(idx, 1);
          }
        }
      }
    };
  }

  /** 订阅所有事件 */
  subscribeAll(handler: EventHandler): () => void {
    this.wildcard.push({ handler, async: false });
    return () => {
      const idx = this.wildcard.indexOf({ handler, async: false });
      if (idx >= 0) {
        this.wildcard.splice(idx, 1);
      }
    };
  }

  /** 发布事件 */
  publish<T = unknown>(type: GatewayEventType, payload: T, requestId?: string): GatewayEvent<T> {
    const event: GatewayEvent<T> = {
      type,
      id: uuid(),
      timestamp: new Date().toISOString(),
      requestId,
      payload,
    };
    this.dispatch(event);
    return event;
  }

  /** 发布已构造事件 */
  publishEvent<T = unknown>(event: GatewayEvent<T>): void {
    this.dispatch(event);
  }

  /** 取消全部订阅（测试用） */
  clear(): void {
    this.subscriptions.clear();
    this.wildcard.length = 0;
  }

  /** 订阅数统计（测试用） */
  get subscriberCount(): number {
    return this.subscriptions.size + this.wildcard.length;
  }

  private dispatch(event: GatewayEvent): void {
    const subs = [...(this.subscriptions.get(event.type) ?? []), ...this.wildcard];
    for (const sub of subs) {
      try {
        const result = sub.handler(event);
        if (sub.async && result instanceof Promise) {
          result.catch((err) => {
            // eslint-disable-next-line no-console
            console.error(`[event-bus] async handler error for ${event.type}:`, err);
          });
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`[event-bus] handler error for ${event.type}:`, err);
      }
    }
  }
}
