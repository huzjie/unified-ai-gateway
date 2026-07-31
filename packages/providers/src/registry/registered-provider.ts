import type { HealthStatus, ProviderAdapter } from '@uag/types';

/**
 * 运行时 Provider 包装（含健康状态）
 */
export class RegisteredProvider {
  constructor(
    readonly adapter: ProviderAdapter,
    private healthStatus: HealthStatus = 'unknown',
  ) {}

  get name(): string {
    return this.adapter.name;
  }

  get type(): string {
    return this.adapter.type;
  }

  get health(): HealthStatus {
    return this.healthStatus;
  }

  setHealth(status: HealthStatus): void {
    this.healthStatus = status;
  }

  /** 是否可路由（healthy 或 unknown） */
  isRoutable(): boolean {
    return this.healthStatus !== 'unhealthy';
  }
}
