import type { GatewayConfig, ProviderAdapter } from '@uag/types';
import type { FastifyInstance } from 'fastify';
import { AliasResolver, BreakerRegistry, CostCalculator, EventBus, LimiterManager, ModelAliasManager, PricingTableImpl, RouterEngine, RouteResolver, StrategyFactory, TokenBucket, ConcurrencyLimiter, createLogger, type Logger } from '@uag/core';
import { ProviderRegistry } from '@uag/providers';
import { ProviderFactory, ProviderConfigMapper } from '@uag/providers';
import { CryptoService, StorageFactory } from '@uag/storage';
import type { RepositoryGroup } from '@uag/storage';
import { ChatService } from './chat-service';
import { StreamingService } from './streaming-service';
import { KeyService } from './key-service';
import { ProviderAdminService } from './provider-admin-service';
import { RouteAdminService } from './route-admin-service';
import { LogService } from './log-service';
import { StatsService } from './stats-service';
import { SettingsService } from './settings-service';
import { AuthService } from './auth-service';
import { AuditService } from './audit-service';
import { DashboardService } from './dashboard-service';
import { ExportService } from './export-service';
import { WebhookService } from './webhook-service';
import { QuotaService } from './quota-service';
import { CacheService } from './cache-service';
import { NotificationService } from './notification-service';
import { ModelCatalogService } from './model-catalog-service';
import { RuntimeConfig } from '../config/runtime-config';

/**
 * 运行时组件注册表（DI 容器）
 */
export class RuntimeRegistry {
  // config
  readonly config: GatewayConfig;
  readonly settings: RuntimeConfig;

  // infra
  readonly logger: Logger;
  readonly storage: StorageFactory;
  readonly repos: RepositoryGroup;
  readonly eventBus: EventBus;

  // core engines
  readonly limiter: LimiterManager;
  readonly breaker: BreakerRegistry;
  router: RouterEngine;
  readonly costCalculator: CostCalculator;
  readonly aliasManager: ModelAliasManager;
  readonly aliasResolver: AliasResolver;

  // providers
  readonly providers: ProviderRegistry;
  readonly providerFactory = new ProviderFactory();
  readonly providerConfigMapper = new ProviderConfigMapper();
  readonly crypto: CryptoService;

  // services
  readonly chatService: ChatService;
  readonly streamingService: StreamingService;
  readonly keyService: KeyService;
  readonly providerAdminService: ProviderAdminService;
  readonly routeAdminService: RouteAdminService;
  readonly logService: LogService;
  readonly statsService: StatsService;
  readonly settingsService: SettingsService;
  readonly authService: AuthService;
  readonly auditService: AuditService;
  readonly dashboardService: DashboardService;
  readonly exportService: ExportService;
  readonly webhookService: WebhookService;
  readonly quotaService: QuotaService;
  readonly cacheService: CacheService;
  readonly notificationService: NotificationService;
  readonly modelCatalogService: ModelCatalogService;

  /** 明文 Key → 存储哈希 索引（内存） */
  readonly keyHashIndex = new Map<string, string>();

  private _server: FastifyInstance | null = null;

  constructor(config: GatewayConfig) {
    this.config = config;
    this.logger = createLogger({ level: config.logLevel });
    this.settings = new RuntimeConfig({
      defaultTimeoutMs: config.defaultTimeoutMs,
      defaultMaxRetries: config.defaultMaxRetries,
      breakerFailureThreshold: config.circuitBreaker.failureThreshold ?? 0.5,
      breakerMinRequests: config.circuitBreaker.minRequests ?? 10,
      breakerOpenMs: config.circuitBreaker.openMs ?? 30000,
      globalQps: config.rateLimit.globalQps,
      globalConcurrency: config.rateLimit.globalConcurrency,
      webhookUrl: null,
      alertRateLimited: false,
      alertCircuitOpen: false,
      alertQuotaExceeded: false,
      logRetentionDays: config.logRetentionDays,
      cacheEnabled: false,
      updatedAt: new Date().toISOString(),
    });

    // 存储
    this.storage = new StorageFactory({
      type: config.storage.type as 'sqlite',
      databasePath: config.storage.databasePath,
    });
    this.repos = this.storage.repos;

    // 事件总线
    this.eventBus = new EventBus();

    // 核心引擎
    this.limiter = new LimiterManager(new TokenBucket(), new ConcurrencyLimiter());
    this.breaker = new BreakerRegistry({
      failureThreshold: config.circuitBreaker.failureThreshold,
      minRequests: config.circuitBreaker.minRequests,
      openMs: config.circuitBreaker.openMs,
      halfOpenRatio: config.circuitBreaker.halfOpenRatio ?? 0.5,
    });
    this.aliasManager = new ModelAliasManager(config.aliases ?? {});
    this.aliasResolver = new AliasResolver(this.aliasManager);
    this.providers = new ProviderRegistry();
    this.crypto = new CryptoService(config.providerKeyEncryptionKey);

    // 路由引擎（延迟到 reloadRouteRules 建立 source）
    this.router = this.buildRouter();

    // 成本
    const pricingTable = new PricingTableImpl();
    this.costCalculator = new CostCalculator(pricingTable);

    // 服务
    this.logService = new LogService(this);
    this.auditService = new AuditService(this);
    this.chatService = new ChatService(this);
    this.streamingService = new StreamingService(this, this.chatService);
    this.keyService = new KeyService(this);
    this.providerAdminService = new ProviderAdminService(this);
    this.routeAdminService = new RouteAdminService(this);
    this.statsService = new StatsService(this);
    this.settingsService = new SettingsService(this);
    this.authService = new AuthService(this);
    this.dashboardService = new DashboardService(this);
    this.exportService = new ExportService(this);
    this.webhookService = new WebhookService(this);
    this.quotaService = new QuotaService(this);
    this.cacheService = new CacheService(this);
    this.notificationService = new NotificationService(this);
    this.modelCatalogService = new ModelCatalogService(this);
  }

  /** 注册 Provider 适配器（从实体 + 解密 Key） */
  async registerProviderAdapter(entity: {
    id: string;
    name: string;
    type: string;
    baseUrl: string;
    encryptedApiKey: string | null;
    models: string[];
    timeoutMs: number;
    maxRetries: number;
  }): Promise<void> {
    const apiKey = entity.encryptedApiKey ? this.crypto.decrypt(entity.encryptedApiKey) : null;
    const adapter = this.providerFactory.create(
      this.providerConfigMapper.map(
        {
          ...entity,
          pricing: {},
          enabled: 'enabled',
          healthStatus: 'unknown',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as never,
        apiKey,
      ) as never,
    );
    this.providers.register(adapter as ProviderAdapter);
  }

  /** 重载路由规则（从存储） */
  reloadRouteRules(): void {
    this.router = this.buildRouter();
  }

  /** 构建路由引擎 */
  private buildRouter(): RouterEngine {
    const source = {
      listEnabledRules: () => this.repos.routeRule.listEnabled(),
      resolveModel: (_provider: string, virtualModel: string) => {
        // 别名解析：若虚拟模型是别名，返回其主候选模型；否则原样
        const alias = this.aliasManager.get(virtualModel);
        return alias ? alias.primary : virtualModel;
      },
      getProviderInputPrice: (_provider: string, _model: string) => undefined,
      getProviderOutputPrice: (_provider: string, _model: string) => undefined,
      getProviderWeight: () => 1,
      isProviderHealthy: (_provider: string) => true,
      listAllProviders: () => this.providers.list().map((p) => p.name),
    };
    return new RouterEngine(new RouteResolver(source), new StrategyFactory());
  }

  /** 附加 Fastify 实例（供登录签发 JWT） */
  attachServer(server: FastifyInstance): void {
    this._server = server;
  }

  /** 签发 JWT */
  async jwtSign(payload: Record<string, unknown>): Promise<string> {
    if (!this._server) {
      throw new Error('Server not attached');
    }
    return this._server.jwt.sign(payload);
  }

  /** 关闭资源 */
  async shutdown(): Promise<void> {
    this.storage.close();
  }
}
