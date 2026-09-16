import { describe, expect, it, vi } from "vitest";
import { getAdminOrderRoute } from "./GetAdminOrderRoute";

const order = {
  orderId: "order-1",
  quoteId: "quote-1",
  customerId: "customer-1",
  address: null,
  status: "paid" as const,
  createdAt: "2026-09-16T08:00:00.000Z",
  updatedAt: "2026-09-16T09:00:00.000Z",
  market: { gold18Price: 23_549_000, currencyPrice: 1_000_000, ouncePrice: 4_500, updatedAt: "2026-09-16T07:59:00.000Z" },
  items: [],
  total: 1_000_000,
};

const statusHistory = [
  { orderId: "order-1", fromStatus: null, toStatus: "pending_confirmation" as const, changedAt: "2026-09-16T08:00:00.000Z" },
  { orderId: "order-1", fromStatus: "confirmed" as const, toStatus: "paid" as const, changedAt: "2026-09-16T09:00:00.000Z" },
];

describe("getAdminOrderRoute", () => {
  it("returns order details with status history", async () => {
    const useCase = { executeAdminWithHistory: vi.fn(async () => ({ order, statusHistory })) };
    const response = await getAdminOrderRoute(useCase as never, " order-1 ");
    expect(response.status).toBe(200);
    expect(useCase.executeAdminWithHistory).toHaveBeenCalledWith({ orderId: "order-1" });
    expect(await response.json()).toEqual({ order, statusHistory });
  });

  it("returns 404 when the order does not exist", async () => {
    const useCase = { executeAdminWithHistory: vi.fn(async () => null) };
    const response = await getAdminOrderRoute(useCase as never, "missing");
    expect(response.status).toBe(404);
  });

  it("rejects an empty order id", async () => {
    const response = await getAdminOrderRoute({ executeAdminWithHistory: vi.fn() } as never, "   ");
    expect(response.status).toBe(400);
  });
});
