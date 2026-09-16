# Website V2 — Admin Order Timeline Snapshot

Date: 2026-09-16

## Scope

Admin Order Console now exposes the server-backed order status Timeline and refreshes it after every successful status transition.

## Branch

`feature/website-v2-order-fulfillment`

## Head before snapshot branch

`1e3ed3f459b2e35a01d40ca0d2625bd6abba347e`

## Admin UI

- Selected orders are loaded through `GET /api/admin/orders/:orderId`.
- Admin detail state now carries both `order` and `statusHistory`.
- Timeline renders the persisted history entries returned by the API.
- Selecting an order from the list loads its full details and history instead of using the list row as the detail source.
- After a successful status POST, the console performs a fresh GET for the same order and replaces the detail state with the server response, including the new history entry.
- The order list is updated from the successful mutation response.

## History integrity

The UI does not synthesize history locally. The source remains the application API backed by the order repository and D1 status-history trigger.

## Validation

GitHub Actions CI run `904` for commit `1e3ed3f459b2e35a01d40ca0d2625bd6abba347e` completed successfully:

- TypeScript: passed
- Vitest: passed
- Website lint: passed
- Website build: passed
- Cloudflare runtime build: passed

## Notes

The repository contract change for `getStatusHistory()` required updating the `CancelCustomerOrderUseCase` fake repository test double. That fix is included in this checkpoint.

No production deployment or merge to `feature/website-v2` is performed by this snapshot.
