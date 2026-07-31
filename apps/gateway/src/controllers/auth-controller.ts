import type { RuntimeRegistry } from '../services/runtime-registry';

export class AuthController {
  constructor(private readonly runtime: RuntimeRegistry) {}

  login(body: Record<string, unknown>) {
    return this.runtime.authService.login(String(body.username), String(body.password));
  }
}
