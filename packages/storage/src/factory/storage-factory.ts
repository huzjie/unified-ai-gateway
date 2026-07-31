import { ConnectionFactory } from '../connection/connection-factory';
import { Database } from '../db/database';
import { RepositoryFactory, type RepositoryGroup } from './repository-factory';

/** 存储总工厂配置 */
export interface StorageFactoryConfig {
  type: 'sqlite' | 'memory';
  databasePath: string;
}

/**
 * 存储总工厂（连接 + 迁移 + 仓储）
 */
export class StorageFactory {
  private database: Database;
  private repositories: RepositoryGroup;

  constructor(config: StorageFactoryConfig) {
    const connectionFactory = new ConnectionFactory({
      type: config.type,
      databasePath: config.databasePath,
    });
    const connection = connectionFactory.create();
    this.database = new Database(connection);
    this.repositories = new RepositoryFactory(connection).createGroup();
  }

  get db(): Database {
    return this.database;
  }

  get repos(): RepositoryGroup {
    return this.repositories;
  }

  close(): void {
    this.database.close();
  }
}
