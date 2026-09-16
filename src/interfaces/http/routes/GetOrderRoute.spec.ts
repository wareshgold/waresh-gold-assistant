import { describe, expect, it, vi } from "vitest";
import { getOrderRoute } from "./GetOrderRoute";

const order = {
  orderId: "order-1",
  quoteId: "quote-1",
  customerId: "customer-1",
  address: null,
  status: "pending_confirmation" as const,
  createdAt: "2026-09-09T07:00:00.000Z",
  updatedAt: "2026-09-09T07:00:00.000Z",
  market: {
    gold18Price: 23_549_000,
    currencyPrice: 1_000_000,
    ouncePrice: 4_000,
    updatedAt: "2026-09-09T07:00:00.000Z",
  },
  items: [],
  total: 0,
};

const statusHistory = [
  { orderId: "order-1", fromStatus: null, toStatus: "pending_confirmation" as const, changedAt: "2026-09-09T07:00:00.000Z" },
  { orderId: "order-1", fromStatus: "pending_confirmation" as const, toStatus: "confirmed" as const, changedAt: "2026-09-09T08:00:00.000Z" },
];

describe("getOrderRoute", () => {
  it("rejects unauthenticated order detail requests", async () => {
    const getOrderUseCase = { executeWithHistory: vi.fn() };
    const response = await getOrderRoute(new Request("http://localhost/api/v1/orders/order-1"), getOrderUseCase as never, "order-1");
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "احراز هویت لازم است." });
    expect(getOrderUseCase.executeWithHistory).not.toHaveBeenCalled();
  });

  it("returns the order and status history for the authenticated owner", async () => {
    const getOrderUseCase = { executeWithHistory: vi.fn(async () => ({ order, statusHistory })) };
    const response = await getOrderRoute(new Request("http://localhost/api/v1/orders/order-1"), getOrderUseCase as never, "order-1", " customer-1 ");
    expect(response.status).toBe(200);
    expect(getOrderUseCase.executeWithHistory).toHaveBeenCalledWith({ orderId: "order-1", customerId: "customer-1" });
    expect(await response.json()).toEqual({ order, statusHistory });
  });

  it("does not reveal another customer's order or history", async () => {
    const getOrderUseCase = { executeWithHistory: vi.fn(async () => null) };
    const response = await getOrderRoute(new Request("http://localhost/api/v1/orders/order-1"), getOrderUseCase as never, "order-1", "customer-2");
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "سفارش پیدا نشد." });
  });
});
