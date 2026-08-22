# Waresh Gold Assistant — Baseline / Recovery Checkpoint

**Date:** 2026-08-22
**Protected baseline commit:** `a2fc0b8`
**Protected GitHub tag:** `checkpoint/ai-strategy-a-vip-2026-08-22`
**Baseline branch:** `feature/vip-foundation`
**Current work branch:** `fix/vip-strategy-a-production-readiness`

## Purpose

This document is the recovery map for the project checkpoint reached on 2026-08-22. If conversational memory is lost, read this document first. The protected Git tag and this document are the source of truth for the project state and continuation path.

## Safe baseline

The known-good baseline is commit `a2fc0b8`, protected by the GitHub tag `checkpoint/ai-strategy-a-vip-2026-08-22`.

At this checkpoint:
- `feature/vip-foundation` was rebased onto current `main`.
- The rebased branch was pushed successfully with `--force-with-lease`.
- Local and remote `feature/vip-foundation` were synchronized.
- `pnpm exec tsc --noEmit` passed.
- Full Vitest suite passed: **47 test files / 129 tests**.
- The checkpoint tag was created and verified on GitHub.
- The checkpoint is intentionally preserved before production-readiness changes.

## Path taken to this checkpoint

1. Built the AI Foundation / AI Tool Execution architecture.
2. Kept financial calculations inside trusted domain/application services rather than AI.
3. Integrated StrategyA across Domain, Application, and Infrastructure layers.
4. Added OunceMarkets tick parsing and collection.
5. Added Ounce tick persistence with D1 support and memory fallback.
6. Added StrategyA strategy evaluation and signal orchestration.
7. Added VIP Foundation: domain model, access service, activation flow, repositories, and D1 support.
8. Connected actionable StrategyA signals to VIP-user notification orchestration.
9. Integrated relevant Telegram handlers, formatters, and bootstrap composition.
10. Rebased `feature/vip-foundation` onto `main`.
11. Verified TypeScript and the full test suite.
12. Protected the checkpoint with a GitHub tag before further production-readiness work.
13. Created the new continuation branch `fix/vip-strategy-a-production-readiness` from the protected checkpoint.

## Architecture checkpoint

```text
Interfaces / Telegram
        ↓
Application
  ├── AI orchestration + tools
  ├── VIP use cases/services
  └── StrategyA strategy/use cases/jobs
        ↓
Domain
  ├── Gold rules/calculations
  ├── VIP model
  └── StrategyA signal engine/model
        ↓
Infrastructure
  ├── AI provider integration
  ├── Telegram market sources
  ├── D1 repositories
  └── Cloudflare integrations
```

Telegram is an interface/adapter. Domain business rules must remain independent of Telegram, HTTP, databases, AI providers, and Cloudflare.

## Findings to resolve next

### Must review/fix before production PR

1. **VIP hard-coded activation codes** — remove production-like VIP codes from bootstrap/source code.
2. **VIP test seed migration** — review/remove test VIP codes from production migrations; separate development/test seeding from production schema migrations.
3. **StrategyA scheduler wiring** — verify and deliberately wire `StrategyASignalSchedulerJob` only after defining cadence and execution semantics.
4. **StrategyA publication idempotency** — prevent duplicate publication/notification of the same actionable signal before enabling automated scheduling.
5. **Production configuration** — verify `wrangler.jsonc`, especially production API URLs, cron cadence, bindings, and environment assumptions.

### Should review

6. Confirm VIP Memory vs D1 repository selection in runtime composition.
7. Evaluate durable/auditable persistence for StrategyA signals.
8. Define notification failure and retry semantics.
9. Review `create-snapshot.ps1` for safe and intentional commit/tag/push behavior.
10. Review AI ↔ StrategyA/VIP boundaries for accidental coupling.

## Planned path forward

1. Keep `checkpoint/ai-strategy-a-vip-2026-08-22` immutable as the rollback point.
2. Work only on `fix/vip-strategy-a-production-readiness` for the next changes.
3. Audit the five must-fix areas before changing business behavior.
4. Make small, test-backed changes while preserving Clean Architecture boundaries.
5. Run `pnpm exec tsc --noEmit` and the full Vitest suite after each meaningful group of changes.
6. Review the final diff against `main`.
7. Push the branch and create a focused PR only after the branch is clean.
8. Keep the baseline tag available as the immediate rollback/recovery point.

## Recovery instructions

If ChatGPT memory or project conversation context is lost:

1. Open this file on GitHub.
2. Fetch all branches and tags:

```powershell
git fetch origin --prune --tags
```

3. Safe baseline:

```powershell
git switch --detach checkpoint/ai-strategy-a-vip-2026-08-22
```

4. Protected baseline commit: `a2fc0b8`.
5. Active continuation branch: `fix/vip-strategy-a-production-readiness`.
6. Do not delete or rewrite the checkpoint tag.
7. Read this document before making architectural changes.

## Source of truth

The old closed VIP PR is **not** the current source of truth.

The current source of truth is:
- GitHub tag `checkpoint/ai-strategy-a-vip-2026-08-22`
- commit `a2fc0b8`
- this recovery document
- current continuation branch `fix/vip-strategy-a-production-readiness`
