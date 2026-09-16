import { describe, expect, it, vi } from "vitest";
import { listCustomerOrdersRoute } from "./ListCustomerOrdersRoute";

const orders = [
    {
        orderId: "order-1",
        customerId: "customer-1",
        status: "confirmed",
        total: 5_000_000,
    },
];

describe("listCustomerOrdersRoute", () => {
    it("returns the customer's orders without caching", async () => {
        const execute = vi.fn(async () => orders);
        const useCase = { execute };

        const response = await listCustomerOrdersRoute(useCase as never, " customer-1 ");

        expect(response.status).toBe(200);
        expect(response.headers.get("Cache-Control")).toBe("no-store");
        expect(execute).toHaveBeenCalledWith({ customerId: " customer-1 " });
        expect(await response.json()).toEqual({ orders });
    });

    it("maps use-case failures to a safe client error", async () => {
        const execute = vi.fn(async () => {
            throw new Error("internal failure");
        });
        const response = await listCustomerOrdersRoute({ execute } as never, "customer-1");

        expect(response.status).toBe(400);
        expect(response.headers.get("Cache-Control")).toBe("no-store");
        expect(await response.json()).toEqual({ error: "دریافت سفارش‌ها انجام نشد." });
    });
});
