import { describe, expect, it } from "vitest";
import { getOrderRoute } from "./GetOrderRoute";

const history = [
    { orderId: "order-1", fromStatus: null, toStatus: "confirmed" as const, changedAt: "2026-09-16T09:00:00.000Z" },
    { orderId: "order-1", fromStatus: "confirmed" as const, toStatus: "paid" as const, changedAt: "2026-09-16T09:01:00.000Z" },
    { orderId: "order-1", fromStatus: "paid" as const, toStatus: "processing" as const, changedAt: "2026-09-16T09:02:00.000Z" },
    { orderId: "order-1", fromStatus: "processing" as const, toStatus: "completed" as const, changedAt: "2026-09-16T09:03:00.000Z" },
];

const order = {
    orderId: "order-1",
    quoteId: "quote-1",
    customerId: "customer-1",
    address: null,
    status: "completed" as const,
    createdAt: "2026-09-16T09:00:00.000Z",
    updatedAt: "2026-09-16T09:03:00.000Z",
    market: { gold18Price: 23_549_000, currencyPrice: 1_000_000, ouncePrice: 4_000, updatedAt: "2026-09-16T09:00:00.000Z" },
    items: [],
    total: 5_000_000,
};

describe("getOrderRoute status history", () => {
    it("returns the complete server-backed fulfillment history to the owner", async () => {
        const getOrderUseCase = {
            executeWithHistory: async () => ({ order, statusHistory: history }),
        } as never;

        const response = await getOrderRoute(new Request("https://example.test/api/orders/order-1"), getOrderUseCase, "order-1", "customer-1");
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(response.headers.get("Cache-Control")).toBe("no-store");
        expect(body.order.status).toBe("completed");
        expect(body.statusHistory).toEqual(history);
    });

    it("does not return history when the order is not owned by the customer", async () => {
        const getOrderUseCase = {
            executeWithHistory: async () => null,
        } as never;

        const response = await getOrderRoute(new Request("https://example.test/api/orders/order-1"), getOrderUseCase, "order-1", "customer-2");
        const body = await response.json();

        expect(response.status).toBe(404);
        expect(body).toEqual({ error: "سفارش پیدا نشد." });
    });
});
