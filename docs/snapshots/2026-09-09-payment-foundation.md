# Waresh Gold Platform — Official Snapshot

**Date:** 2026-09-09
**Branch:** `feature/website-v2`
**Milestone:** Payment Foundation
**Status:** Foundation implemented; production gateway verification intentionally deferred.

## Current baseline

The website/admin commerce foundation is operational through order creation, order history, admin listing, authenticated admin lifecycle management, and session restoration.

## This milestone

Payment was introduced as an independent architectural capability:

- Payment domain entity and status model
- Payment repository abstraction
- Payment gateway abstraction
- `CreatePaymentUseCase`
- Memory payment repository for tests/development
- D1 payment repository
- Mock payment gateway
- D1 `payments` persistence schema
- Unit coverage for payment creation and duplicate active-payment protection
- Architecture documentation

## Payment rules

1. Only `confirmed` orders can start payment.
2. Payment amount is derived from the trusted `Order.total` snapshot.
3. A second active payment for the same order is rejected.
4. Already-paid orders cannot start another payment.
5. Gateway initiation failures persist the payment as `failed`.
6. The domain has no dependency on a specific payment provider.

## Architecture boundary

```text
Website / Telegram / API
          ↓
   Application Layer
   CreatePaymentUseCase
          ↓
      Domain Layer
 Payment + PaymentGateway
          ↓
 Infrastructure Adapters
 D1 Repository / Mock Gateway
```

The real provider (for example ZarinPal or another gateway) will be introduced only as an infrastructure adapter.

## Deliberate next step

The following are **not** part of this snapshot and must be implemented as a separate verified milestone:

- `VerifyPaymentUseCase`
- provider callback/return boundary
- trusted amount/authority verification
- safe `initiated → paid` transition
- order `confirmed → paid` transition through application/domain rules
- real gateway adapter
- checkout payment UI

## Validation target

CI must remain green after this milestone. No payment provider secret or credential is stored in source control.
