import type { Command } from 'commander';
import { registerKeyCommand } from './key.command';
import { registerProviderCommand } from './provider.command';
import { registerRouteCommand } from './route.command';
import { registerStatsCommand } from './stats.command';
import { registerLogCommand } from './log.command';
import { registerServeCommand } from './serve.command';
import { registerConfigCommand } from './config.command';
import { registerAliasCommand } from './alias.command';
import { registerAuditCommand } from './audit.command';
import { registerExportCommand } from './export.command';
import { registerHealthCommand } from './health.command';
import { registerVersionCommand } from './version.command';

export {
  registerKeyCommand,
  registerProviderCommand,
  registerRouteCommand,
  registerStatsCommand,
  registerLogCommand,
  registerServeCommand,
  registerConfigCommand,
  registerAliasCommand,
  registerAuditCommand,
  registerExportCommand,
  registerHealthCommand,
  registerVersionCommand,
};

export type CommandRegister = (program: Command) => void;
