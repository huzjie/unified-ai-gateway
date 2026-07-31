import { SQLiteConnection } from './sqlite-connection';

/** 连接工厂配置 */
export interface ConnectionFactoryConfig {
  type: 'sqlite' | 'memory';
  databasePath: string;
}

/**
 * 按配置创建连接
 */
export class ConnectionFactory {
  constructor(private readonly config: ConnectionFactoryConfig) {}

  create(): SQLiteConnection {
    if (this.config.type === 'memory') {
      return new SQLiteConnection(':memory:');
    }
    return new SQLiteConnection(this.config.databasePath);
  }
}
