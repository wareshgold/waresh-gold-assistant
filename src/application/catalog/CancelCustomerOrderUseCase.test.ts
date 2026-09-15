import { describe, expect, it } from "vitest";
import type { Order } from "../../domain/catalog/entities/Order";
import type { OrderRepository } from "../../domain/catalog/repositories/OrderRepository";
import { CancelCustomerOrderUseCase } from "./CancelCustomerOrderUseCase";

const makeOrder = (status: Order["status"] = "pending_confirmation"): Order => ({
    orderId: "order-1",
    quoteId: "quote-1",
    customerId: "customer-1",
    address: null,
    status,
    createdAt: "2026-09-13T10:00:00.000Z",
    updatedAt: "2026-09-13T10:00:00.000Z",
    market: {
        gold18Price: 23000000,
        currencyPrice: 220000,
        ouncePrice: 4400,
        updatedAt: "2026-09-13T10:00:00.000Z",
    },
    items: [],
    total: 1000000,
});

class FakeOrderRepository implements OrderRepository {
    public order: Order | null;

    constructor(order: Order | null) {
        this.order = order;
    }

    async save(): Promise<void> {}
    async updateStatus(): Promise<boolean> { return false; }
    async findById(_orderId: string): Promise<Order | null> { return this.order ? structuredClone(this.order) : null; }
    async findByQuoteId(): Promise<Order | null> { return null; }
    async findByCustomerId(): Promise<Order[]> { return []; }
    async findAll(): Promise<Order[]> { return []; }

    async cancelForCustomer(orderId: string, customerId: string, fromStatuses: readonly Order["status"][], updatedAt: string): Promise<boolean> {
        if (!this.order || this.order.orderId !== orderId || this.order.customerId !== customerId || !fromStatuses.includes(this.order.status)) return false;
        this.order = { ...this.order, status: "cancelled", updatedAt };
        return true;
    }
}

describe("CancelCustomerOrderUseCase", () => {
    it("cancels a customer's pending order", async () => {
        const repository = new FakeOrderRepository(makeOrder());
        const useCase = new CancelCustomerOrderUseCase(repository);

        const result = await useCase.execute({ orderId: "order-1", customerId: "customer-1" });

        expect(result.status).toBe("cancelled");
        expect((await repository.findById("order-1"))?.status).toBe("cancelled");
    });

    it("rejects cancellation of another customer's order", async () => {
        const useCase = new CancelCustomerOrderUseCase(new FakeOrderRepository(makeOrder()));

        await expect(useCase.execute({ orderId: "order-1", customerId: "customer-2" }))
            .rejects.toThrow("دسترسی به این سفارش مجاز نیست.");
    });

    it("rejects cancellation after the cancellable lifecycle", async () => {
        const useCase = new CancelCustomerOrderUseCase(new FakeOrderRepository(makeOrder("paid")));

        await expect(useCase.execute({ orderId: "order-1", customerId: "customer-1" }))
            .rejects.toThrow("انتقال وضعیت سفارش از paid به cancelled مجاز نیست.");
    });

    it("rejects a concurrent state change instead of overwriting it", async () => {
        const repository = new FakeOrderRepository(makeOrder("pending_confirmation"));
        repository.cancelForCustomer = async () => {
            repository.order = { ...makeOrder("paid"), updatedAt: "2026-09-13T10:01:00.000Z" };
            return false;
        };
        const useCase = new CancelCustomerOrderUseCase(repository);

        await expect(useCase.execute({ orderId: "order-1", customerId: "customer-1" }))
            .rejects.toThrow("انتقال وضعیت سفارش از paid به cancelled مجاز نیست.");
    });

    it("allows only one of two concurrent cancellation attempts to win", async () => {
        const repository = new FakeOrderRepository(makeOrder("pending_confirmation"));
        const useCase = new CancelCustomerOrderUseCase(repository);

        const results = await Promise.allSettled([
            useCase.execute({ orderId: "order-1", customerId: "customer-1" }),
            useCase.execute({ orderId: "order-1", customerId: "customer-1" }),
        ]);

        expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
        expect(results.filter((result) => result.status === "rejected")).toHaveLength(1);
        expect((await repository.findById("order-1"))?.status).toBe("cancelled");
    });
});
