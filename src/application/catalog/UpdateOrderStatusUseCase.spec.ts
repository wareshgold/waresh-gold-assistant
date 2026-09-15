import { describe, expect, it } from "vitest";
import type { Order } from "../../domain/catalog/entities/Order";
import { MemoryOrderRepository } from "../../infrastructure/catalog/MemoryOrderRepository";
import { UpdateOrderStatusUseCase } from "./UpdateOrderStatusUseCase";

const order: Order = {
    orderId: "order-1",
    quoteId: "quote-1",
    customerId: "customer-1",
    address: null,
    status: "pending_confirmation",
    createdAt: "2026-09-08T06:00:00.000Z",
    updatedAt: "2026-09-08T06:00:00.000Z",
    market: {
        gold18Price: 23_549_000,
        currencyPrice: 1_000_000,
        ouncePrice: 4_000,
        updatedAt: "2026-09-08T06:00:00.000Z",
    },
    items: [],
    total: 0,
};

describe("UpdateOrderStatusUseCase", () => {
    it("updates and persists an allowed status transition", async () => {
        const repository = new MemoryOrderRepository();
        await repository.save(order);
        const useCase = new UpdateOrderStatusUseCase(repository);

        const updated = await useCase.execute({ orderId: order.orderId, status: "confirmed" });

        expect(updated.status).toBe("confirmed");
        await expect(repository.findById(order.orderId)).resolves.toEqual(updated);
    });

    it("rejects an invalid transition without changing the order", async () => {
        const repository = new MemoryOrderRepository();
        await repository.save(order);
        const useCase = new UpdateOrderStatusUseCase(repository);

        await expect(useCase.execute({ orderId: order.orderId, status: "paid" })).rejects.toThrow();
        await expect(repository.findById(order.orderId)).resolves.toEqual(order);
    });

    it("keeps completed orders terminal", async () => {
        const repository = new MemoryOrderRepository();
        const completed = { ...order, status: "completed" as const };
        await repository.save(completed);
        const useCase = new UpdateOrderStatusUseCase(repository);

        await expect(useCase.execute({ orderId: order.orderId, status: "cancelled" })).rejects.toThrow();
        await expect(repository.findById(order.orderId)).resolves.toEqual(completed);
    });

    it("rejects unknown orders", async () => {
        const useCase = new UpdateOrderStatusUseCase(new MemoryOrderRepository());
        await expect(useCase.execute({ orderId: "missing", status: "confirmed" })).rejects.toThrow("سفارش پیدا نشد");
    });

    it("allows only one winner when two requests update the same order concurrently", async () => {
        const repository = new MemoryOrderRepository();
        await repository.save({ ...order, status: "confirmed" });
        const useCase = new UpdateOrderStatusUseCase(repository);

        const results = await Promise.allSettled([
            useCase.execute({ orderId: order.orderId, status: "paid" }),
            useCase.execute({ orderId: order.orderId, status: "cancelled" }),
        ]);

        expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
        expect(results.filter((result) => result.status === "rejected")).toHaveLength(1);
        await expect(repository.findById(order.orderId)).resolves.toMatchObject({
            orderId: order.orderId,
            status: expect.stringMatching(/^(paid|cancelled)$/),
        });
    });

    it("rejects a stale update after another request has already changed the status", async () => {
        const repository = new MemoryOrderRepository();
        await repository.save({ ...order, status: "confirmed" });
        const useCase = new UpdateOrderStatusUseCase(repository);

        await useCase.execute({ orderId: order.orderId, status: "paid" });

        await expect(useCase.execute({ orderId: order.orderId, status: "cancelled" })).rejects.toThrow("وضعیت سفارش دیگر مجاز نیست");
        await expect(repository.findById(order.orderId)).resolves.toMatchObject({ status: "paid" });
    });
});
