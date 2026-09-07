import { describe, expect, it } from "vitest";
import { ListCustomerOrdersUseCase } from "./ListCustomerOrdersUseCase";
import type { Order } from "../../domain/catalog/entities/Order";
import type { OrderRepository } from "../../domain/catalog/repositories/OrderRepository";

const order: Order = {
    orderId: "order-1",
    quoteId: "quote-1",
    customerId: "customer-1",
    status: "pending_confirmation",
    createdAt: "2026-09-07T08:00:00.000Z",
    updatedAt: "2026-09-07T08:00:00.000Z",
    market: { gold18Price: 23549000, currencyPrice: 100000, ouncePrice: 4500, updatedAt: "2026-09-07T07:59:00.000Z" },
    items: [],
    total: 1000000,
};

describe("ListCustomerOrdersUseCase", () => {
    it("lists only orders belonging to the requested customer", async () => {
        const repository: OrderRepository = {
            save: async () => undefined,
            findById: async () => order,
            findByQuoteId: async () => null,
            findByCustomerId: async (customerId) => customerId === "customer-1" ? [order] : [],
        };
        await expect(new ListCustomerOrdersUseCase(repository).execute({ customerId: "customer-1" })).resolves.toEqual([order]);
    });

    it("rejects an empty customer id", async () => {
        const repository: OrderRepository = {
            save: async () => undefined,
            findById: async () => null,
            findByQuoteId: async () => null,
            findByCustomerId: async () => [],
        };
        await expect(new ListCustomerOrdersUseCase(repository).execute({ customerId: " " })).rejects.toThrow("Customer ID is required");
    });
});
