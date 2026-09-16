import { describe, expect, it } from "vitest";
import type { Order } from "../../domain/catalog/entities/Order";
import { MemoryOrderRepository } from "../../infrastructure/catalog/MemoryOrderRepository";
import { ListCustomerOrdersUseCase } from "./ListCustomerOrdersUseCase";

function makeOrder(orderId: string, customerId: string): Order {
    return {
        orderId,
        quoteId: `quote-${orderId}`,
        customerId,
        address: null,
        status: "confirmed",
        createdAt: "2026-09-16T09:00:00.000Z",
        updatedAt: "2026-09-16T09:00:00.000Z",
        market: {
            gold18Price: 23_549_000,
            currencyPrice: 1_000_000,
            ouncePrice: 4_000,
            updatedAt: "2026-09-16T09:00:00.000Z",
        },
        items: [],
        total: 5_000_000,
    };
}

describe("ListCustomerOrdersUseCase", () => {
    it("returns only orders belonging to the requested customer", async () => {
        const repository = new MemoryOrderRepository();
        const ownOrder = makeOrder("order-1", "customer-1");
        const otherOrder = makeOrder("order-2", "customer-2");
        await repository.save(ownOrder);
        await repository.save(otherOrder);

        const useCase = new ListCustomerOrdersUseCase(repository);

        await expect(useCase.execute({ customerId: " customer-1 " })).resolves.toEqual([ownOrder]);
    });

    it("returns an empty list when the customer has no orders", async () => {
        const useCase = new ListCustomerOrdersUseCase(new MemoryOrderRepository());

        await expect(useCase.execute({ customerId: "customer-1" })).resolves.toEqual([]);
    });

    it("rejects an empty customer id before querying the repository", async () => {
        const repository = new MemoryOrderRepository();
        const useCase = new ListCustomerOrdersUseCase(repository);

        await expect(useCase.execute({ customerId: "   " })).rejects.toThrow("Customer ID is required");
    });
});
