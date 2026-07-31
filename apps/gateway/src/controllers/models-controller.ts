import type { RuntimeRegistry } from '../services/runtime-registry';

export class ModelsController {
  constructor(private readonly runtime: RuntimeRegistry) {}

  async list(): Promise<unknown> {
    const models = await this.runtime.modelCatalogService.list();
    return { object: 'list', data: models };
  }
}
