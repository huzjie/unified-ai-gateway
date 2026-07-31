import { ModelAliasManager } from './model-alias-manager';

/**
 * 别名解析器：虚拟模型 → 候选列表
 * 规则：若 model 是已注册别名，返回候选；否则视为直通真实模型名。
 */
export class AliasResolver {
  constructor(private readonly manager: ModelAliasManager) {}

  /**
   * 解析虚拟模型名
   * @returns 解析结果：resolved 为真实模型名，candidates 为 Provider 候选
   */
  resolve(virtualModel: string): { resolved: string; candidates: string[]; isAlias: boolean } {
    const alias = this.manager.get(virtualModel);
    if (alias) {
      return { resolved: alias.targets[0], candidates: alias.targets, isAlias: true };
    }
    // 直通：默认候选为该模型名本身（由 provider 侧决定）
    return { resolved: virtualModel, candidates: [], isAlias: false };
  }
}
