import { describe, expect, it } from "vitest";
import type { Order } from "../../domain/catalog/entities/Order";
import { MemoryOrderRepository } from "../../infrastructure/catalog/MemoryOrderRepository";
import { CancelCustomerOrderUseCase } from "./CancelCustomerOrderUseCase";

const baseOrder: Order = {
    orderId: "order-1",
    quoteId: "quote-1",
    customerId: "customer-1",
    address: null,
    status: "pending_confirmation",
    createdAt: "2026-09-07T06:00:00.000Z",
    updatedAt: "2026-09-07T06:00:00.000Z",
    market: {
        gold18Price: 23_549_000,
        currencyPrice: 1_000_000,
        ouncePrice: 4_000,
        updatedAt: "2026-09-07T06:00:00.000Z",
    },
    items: [],
    total: 1_000_000,
};

async function createUseCase(order: Order = baseOrder) {
    const repository = new MemoryOrderRepository();
    await repository.save(order);
    return { useCase: new CancelCustomerOrderUseCase(repository), repository };
}

describe("CancelCustomerOrderUseCase", () => {
    it("cancels an order only for its owner", async () => {
        const { useCase, repository } = await createUseCase();

        const cancelled = await useCase.execute({ orderId: baseOrder.orderId, customerId: "customer-1" });

        expect(cancelled.status).toBe("cancelled");
        await expect(repository.findById(baseOrder.orderId)).resolves.toMatchObject({ status: "cancelled" });
    });

    it("records the cancellation in status history", async () => {
        const { useCase, repository } = await createUseCase();

        await useCase.execute({ orderId: baseOrder.orderId, customerId: "customer-1" });

        await expect(repository.getStatusHistory(baseOrder.orderId)).resolves.toEqual([
            expect.objectContaining({ fromStatus: null, toStatus: "pending_confirmation" }),
            expect.objectContaining({ fromStatus: "pending_confirmation", toStatus: "cancelled" }),
        ]);
    });

    it("rejects cancellation by another customer without changing the order", async () => {
        const { useCase, repository } = await createUseCase();

        await expect(useCase.execute({ orderId: baseOrder.orderId, customerId: "customer-2" }))
            .rejects.toThrow("دسترسی به این سفارش مجاز نیست");

        await expect(repository.findById(baseOrder.orderId)).resolves.toMatchObject({ status: "pending_confirmation" });
        await expect(repository.getStatusHistory(baseOrder.orderId)).resolves.toHaveLength(1);
    });

    it("rejects cancellation of an already paid order", async () => {
        const { useCase } = await createUseCase({ ...baseOrder, status: "paid" });

        await expect(useCase.execute({ orderId: baseOrder.orderId, customerId: "customer-1" }))
            .rejects.toThrow();
    });

    it("allows cancellation from confirmed state", async () => {
        const { useCase, repository } = await createUseCase({ ...baseOrder, status: "confirmed" });

        await useCase.execute({ orderId: baseOrder.orderId, customerId: "customer-1" });

        await expect(repository.findById(baseOrder.orderId)).resolves.toMatchObject({ status: "cancelled" });
        await expect(repository.getStatusHistory(baseOrder.orderId)).resolves.toHaveLength(2);
    });

    it("rejects a cancellation race without adding a second history entry", async () => {
        const repository = new MemoryOrderRepository();
        await repository.save(baseOrder);
        const originalCancel = repository.cancelForCustomer.bind(repository);
        let firstCall = true;
        repository.cancelForCustomer = async (...args) => {
            if (firstCall) {
                firstCall = false;
                await originalCancel(...args);
            }
            return false;
        };

        const useCase = new CancelCustomerOrderUseCase(repository);

        await expect(useCase.execute({ orderId: baseOrder.orderId, customerId: "customer-1" }))
            .rejects.toThrow("وضعیت سفارش در حین لغو تغییر کرده است");
        await expect(repository.getStatusHistory(baseOrder.orderId)).resolves.toHaveLength(2);
    });
});
