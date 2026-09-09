# Payment Verification Foundation Snapshot

**Date:** 2026-09-09  
**Branch:** `feature/website-v2`  
**Status:** ✅ Complete and CI green  
**Validation commit:** `e697630acb6e90523644544b1e936a511194ca88`

## Milestone

Payment Verification Foundation is implemented as the second stage of the payment capability. The platform can now verify an initiated payment through the payment gateway boundary and transition the corresponding order from `confirmed` to `paid` without trusting client-supplied financial amounts.

## Implemented

- `Payment` domain entity and canonical payment statuses.
- `PaymentRepository` abstraction with active-payment lookup semantics.
- `PaymentGateway` abstraction for initiation and verification.
- `CreatePaymentUseCase` for creating payment attempts from confirmed orders.
- `VerifyPaymentUseCase` for authoritative verification of initiated payments.
- Authority matching against the stored payment authority.
- Verification amount sourced exclusively from the persisted `Payment.amount`.
- Successful verification transitions payment `initiated → paid`.
- Successful verification transitions order `confirmed → paid` through the existing order lifecycle rules.
- Idempotent verification for payments already marked `paid`.
- HTTP adapter: `POST /api/v1/payments/:paymentId/verify`.
- Retry foundation allowing failed/cancelled/expired payment attempts to be retried without allowing multiple active payments for the same order.
- Memory and D1 payment repository support for active payment lookup.
- Mock payment gateway verification flow.
- Unit tests covering verification, authority mismatch, missing payment/order, successful payment transition, idempotency, and retry behavior.
- Application/container wiring for payment verification.
- Payment architecture documentation updated as part of the milestone.

## Security / Trust Rules

1. Only `initiated` payments can enter gateway verification.
2. A client cannot choose the verification amount; the amount comes from the stored payment record.
3. The gateway receives the persisted authority and persisted amount.
4. The supplied authority must match the authority stored on the payment.
5. A payment already marked `paid` is handled idempotently.
6. Order lifecycle transitions remain governed by the domain/application layer.
7. Gateway/provider details remain behind the `PaymentGateway` abstraction.
8. No payment secret or gateway credential is stored in source control.

## Retry Semantics

Payment attempts are modeled as separate records so a failed, cancelled, or expired attempt can be retried. Active states remain mutually exclusive per order (`pending`, `initiated`, `paid`). The database migration preserves existing payment data while replacing the original unconditional `order_id` uniqueness constraint with the correct active-payment uniqueness model.

## Architecture Boundary

```text
HTTP / Checkout Callback
        ↓
Payment Verification Route
        ↓
VerifyPaymentUseCase
        ↓
PaymentRepository + PaymentGateway
        ↓
Payment Domain State
        ↓
Order Lifecycle Domain Rules
```

The domain does not depend on Telegram, HTTP, D1, Cloudflare, or a specific payment provider.

## Validation

GitHub Actions CI for the final validation commit is green:

- **CI run #705:** success
- **Deploy Website #466:** success
- TypeScript validation: passed
- Test suite: passed
- Website deployment: passed

## Deferred / Next Work

- Replace `MockPaymentGateway` with a production Iranian payment gateway adapter.
- Implement provider-specific callback/return handling where required.
- Add gateway-specific authority/reference verification details.
- Add payment UI to checkout/order flows.
- Add operational reconciliation and payment observability.
- Add production webhook/callback hardening according to the selected gateway contract.

## Milestone Decision

**Payment Verification Foundation is accepted as complete.** The next implementation should build on this abstraction rather than introducing gateway logic into checkout pages, Telegram handlers, or domain entities.
