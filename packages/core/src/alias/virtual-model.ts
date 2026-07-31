/**
 * 虚拟模型实体
 */
export class VirtualModel {
  readonly name: string;
  /** Provider 候选列表（有序） */
  readonly targets: string[];

  constructor(name: string, targets: string[]) {
    this.name = name;
    this.targets = [...targets];
  }

  /** 首个候选 */
  get primary(): string {
    return this.targets[0] ?? '';
  }

  /** 后备候选（除首个外） */
  get fallbacks(): string[] {
    return this.targets.slice(1);
  }

  toJSON(): { name: string; targets: string[] } {
    return { name: this.name, targets: this.targets };
  }
}
