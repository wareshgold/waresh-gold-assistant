import { describe, expect, it, vi } from "vitest";
import { updateOrderStatusRoute } from "./UpdateOrderStatusRoute";

const order = {
  orderId: "order-1",
  quoteId: "quote-1",
  customerId: "customer-1",
  address: null,
  status: "processing" as const,
  createdAt: "2026-09-16T08:00:00.000Z",
  updatedAt: "2026-09-16T09:00:00.000Z",
  market: { gold18Price: 23_549_000, currencyPrice: 1_000_000, ouncePrice: 4_500, updatedAt: "2026-09-16T07:59:00.000Z" },
  items: [],
  total: 1_000_000,
};

describe("updateOrderStatusRoute", () => {
  it("returns the updated order", async () => {
    const useCase = { execute: vi.fn(async () => order) };
    const request = new Request("https://example.test/api/v1/admin/orders/order-1/status", {
      method: "POST",
      body: JSON.stringify({ status: "processing" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await updateOrderStatusRoute(request, useCase as never, " order-1 ");

    expect(response.status).toBe(200);
    expect(useCase.execute).toHaveBeenCalledWith({ orderId: "order-1", status: "processing" });
    expect(await response.json()).toEqual({ order });
  });

  it("maps an optimistic concurrency conflict to 409", async () => {
    const useCase = {
      execute: vi.fn(async () => {
        throw new Error("وضعیت سفارش دیگر مجاز نیست؛ سفارش توسط درخواست دیگری تغییر کرده است.");
      }),
    };
    const request = new Request("https://example.test/api/v1/admin/orders/order-1/status", {
      method: "POST",
      body: JSON.stringify({ status: "processing" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await updateOrderStatusRoute(request, useCase as never, "order-1");

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: "وضعیت سفارش دیگر مجاز نیست؛ سفارش توسط درخواست دیگری تغییر کرده است." });
  });

  it("returns 404 when the order does not exist", async () => {
    const useCase = { execute: vi.fn(async () => { throw new Error("سفارش پیدا نشد."); }) };
    const request = new Request("https://example.test/api/v1/admin/orders/order-1/status", {
      method: "POST",
      body: JSON.stringify({ status: "processing" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await updateOrderStatusRoute(request, useCase as never, "order-1");

    expect(response.status).toBe(404);
  });

  it("rejects an invalid status before invoking the use case", async () => {
    const useCase = { execute: vi.fn() };
    const request = new Request("https://example.test/api/v1/admin/orders/order-1/status", {
      method: "POST",
      body: JSON.stringify({ status: "completed-from-nowhere" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await updateOrderStatusRoute(request, useCase as never, "order-1");

    expect(response.status).toBe(400);
    expect(useCase.execute).not.toHaveBeenCalled();
  });
});
