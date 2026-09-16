import { describe, expect, it, vi } from "vitest";
import { cancelCustomerOrderRoute } from "./CancelCustomerOrderRoute";

function createUseCase(result?: { orderId: string; status: "cancelled" }, error?: string) {
    return {
        execute: error
            ? vi.fn().mockRejectedValue(new Error(error))
            : vi.fn().mockResolvedValue(result),
    } as never;
}

describe("cancelCustomerOrderRoute", () => {
    it("returns the cancelled order", async () => {
        const useCase = createUseCase({ orderId: "order-1", status: "cancelled" });

        const response = await cancelCustomerOrderRoute(useCase, " order-1 ", " customer-1 ");

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual({
            order: { orderId: "order-1", status: "cancelled" },
        });
    });

    it("maps an unknown order to 404", async () => {
        const useCase = createUseCase(undefined, "سفارش پیدا نشد.");

        const response = await cancelCustomerOrderRoute(useCase, "order-1", "customer-1");

        expect(response.status).toBe(404);
    });

    it("maps owner access failures to 403", async () => {
        const useCase = createUseCase(undefined, "دسترسی به این سفارش مجاز نیست.");

        const response = await cancelCustomerOrderRoute(useCase, "order-1", "customer-2");

        expect(response.status).toBe(403);
    });

    it("maps lifecycle conflicts to 409", async () => {
        const useCase = createUseCase(undefined, "لغو سفارش از این وضعیت مجاز نیست.");

        const response = await cancelCustomerOrderRoute(useCase, "order-1", "customer-1");

        expect(response.status).toBe(409);
    });

    it("maps a cancellation race to 409", async () => {
        const useCase = createUseCase(undefined, "وضعیت سفارش در حین لغو تغییر کرده است. دوباره تلاش کنید.");

        const response = await cancelCustomerOrderRoute(useCase, "order-1", "customer-1");

        expect(response.status).toBe(409);
    });
});
