# Waresh Gold Assistant — Website V2 Snapshot

Date: 2026-09-14
Branch: `feature/website-v2`
HEAD: `3019997ccadf9d5037e918bb0a8a6629530fc825`

## Current state
- CI run 857 (`34843094092`): SUCCESS.
- Website deploy run 618 (`34843094249`): SUCCESS.
- Latest payment UI commit: `3019997ccadf9d5037e918bb0a8a6629530fc825` (`fix: simplify payment button`).

## This session — payment flow
Target: `Product → Cart → Checkout → Quote → Order → Payment → Verify → Paid → Order Tracking`

Added:
- `dashboard/src/components/PaymentButton.tsx` — authenticated payment creation, loading/error handling, internal/external payment navigation.
- `dashboard/src/app/checkout/payment/mock/page.tsx` — mock/test gateway UI; verifies via `/api/payment/verify/{paymentId}` and returns to order tracking.
- `dashboard/src/app/order/[orderId]/page.tsx` — shows payment action only for `confirmed` orders.

Important: the gateway UI is MOCK/TEST only. Real Iranian bank gateway integration is a future separate task.

## Security work already completed
- `VerifyPaymentUseCase` now checks payment order ownership against `customerId` BEFORE returning an already-paid payment or continuing verification. Prevents cross-customer payment probing.
  Commit: `f1aabb72cd748149fc534b0502b6b1d0a4c1cab4`
- Verify route requires customer session, forwards `X-Customer-Session`, supports POST/GET callback, requires authority, and uses no-store/timeout/body guards.
  Commit: `4197b83871625b0f2100e46e318153236630730d`
- Verify route tests fixed with `vi.hoisted()` and cover POST, GET callback, missing authority, backend errors/unavailable.
  Commit: `8d878d056b9f96ab9f404cff6fec02a7b09daf07`
- Verify use-case regression tests cover cross-customer access to an already-paid payment.
  Commit: `8ef1051b276a5c6482fcf6e2abb7e68dbef1a7a0`
- Generic API error handling no longer leaks internal error details; generic errors return `INTERNAL_ERROR` while full details stay in server logs.
  Commit: `48a9c29b94bc465a007a46fdf98f3ab97966c9f5`

## Auth/order status
Verified:
- Admin auth is fail-closed, session is HttpOnly/Secure/SameSite=Strict with 8h lifetime, admin APIs are protected.
- Customer order lookup is ownership-scoped.
- Order creation from quote validates customer/address ownership and handles quote races.
- Payment creation requires authenticated customer ownership.
- Payment settlement guards payment/order state transitions.
- Customer address operations and cancellation are customer-scoped.

## Architecture rules
- Clean Architecture / DDD / SOLID.
- Domain/business logic independent from Telegram, HTTP, DB, Cloudflare, AI, and UI.
- Financial calculations stay in trusted domain services.
- Reuse abstractions; avoid duplicated business logic.
- Preserve portability for Website/Mobile/API/CRM.
- Do not continue feature work while CI is failing; get green first.
- Normal workflow: user runs `git pull`, then PowerShell commands and reports output.

## Next chat starting point
Read this snapshot first, then check branch/HEAD and CI/deploy. Continue from `feature/website-v2` at `3019997ccadf9d5037e918bb0a8a6629530fc825`.

Do NOT mix this project with `wareshgold/xauusd-strategy-a`, which is a separate research project.
