# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Continuous integration hardened: least-privilege `permissions: contents: read`
  on every workflow (OpenSSF Scorecard *Token-Permissions*).

## [v0.1.0] - 2026-08-06

### Added
- Self-hosted, OpenAI-compatible gateway in front of multiple LLM providers.
- Smart routing, load balancing, failover, rate limiting and circuit breaking.
- Cost tracking and usage analytics with an admin console.
- pnpm/turbo TypeScript monorepo: core, storage, providers, gateway, cli, web.

### Security
- CodeQL static analysis enabled.
- Least-privilege GitHub Actions token permissions on all workflows.

[Unreleased]: https://github.com/huzjie/unified-ai-gateway/compare/v0.1.0...HEAD
[v0.1.0]: https://github.com/huzjie/unified-ai-gateway/releases/tag/v0.1.0
