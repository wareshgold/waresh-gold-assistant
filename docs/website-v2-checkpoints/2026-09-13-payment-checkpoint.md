# Website V2 — Payment Checkpoint

Date: 2026-09-13
Branch: `feature/website-v2`

## Current state

Payment backend foundation is implemented and type-safe:

- `CreatePaymentUseCase` is composed in the application container.
- `VerifyPaymentUseCase` is composed in the application container.
- `POST /api/v1/payments` exposes payment creation.
- Payment amount is derived from the persisted order total; the client does not provide an amount.
- `POST /api/v1/payments/:paymentId/verify` is already wired in the HTTP application.
- The test container includes the payment use cases.

## Validation

- Vitest: **71 test files passed / 254 tests passed**.
- TypeScript: **`pnpm exec tsc --noEmit` passed** after fixing the test container.

## Deliberately deferred

The Website V2 payment UI/API-proxy integration is **not being connected or deployed yet**.

The user does not currently intend to run the site or place products on it. The current payment work is therefore a backend foundation/checkpoint only.

## Next continuation

When Website V2 execution resumes, continue from this checkpoint by reviewing the remaining work rather than immediately wiring the payment UI. First inspect the current repository state and identify the highest-value remaining Website V2 tasks.
