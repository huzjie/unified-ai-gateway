import { VirtualModel } from './virtual-model';

/**
 * 模型别名管理器（CRUD 与校验）
 * 别名：虚拟模型名 → Provider 候选列表（如 my-main → ['moonshot', 'deepseek']）
 */
export class ModelAliasManager {
  private aliases = new Map<string, VirtualModel>();

  constructor(initial?: Record<string, string[]>) {
    if (initial) {
      for (const [name, targets] of Object.entries(initial)) {
        this.set(name, targets);
      }
    }
  }

  /** 设置别名 */
  set(name: string, targets: string[]): VirtualModel {
    this.validateName(name);
    this.validateTargets(targets);
    const model = new VirtualModel(name, targets);
    this.aliases.set(name, model);
    return model;
  }

  /** 获取别名 */
  get(name: string): VirtualModel | null {
    return this.aliases.get(name) ?? null;
  }

  /** 删除别名 */
  delete(name: string): boolean {
    return this.aliases.delete(name);
  }

  /** 列出全部别名 */
  list(): VirtualModel[] {
    return [...this.aliases.values()];
  }

  /** 是否存在 */
  has(name: string): boolean {
    return this.aliases.has(name);
  }

  /** 校验别名名（非空、无空格） */
  private validateName(name: string): void {
    if (!name || typeof name !== 'string') {
      throw new Error('别名名称不能为空');
    }
    if (/\s/.test(name)) {
      throw new Error('别名名称不能包含空白字符');
    }
  }

  /** 校验目标列表（非空） */
  private validateTargets(targets: string[]): void {
    if (!Array.isArray(targets) || targets.length === 0) {
      throw new Error('别名目标列表不能为空');
    }
    const unique = new Set(targets);
    if (unique.size !== targets.length) {
      throw new Error('别名目标列表包含重复项');
    }
  }
}
