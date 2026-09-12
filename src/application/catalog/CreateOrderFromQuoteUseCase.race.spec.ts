import { describe, expect, it } from "vitest";
import type { Customer } from "../../domain/customer/entities/Customer";
import type { Order } from "../../domain/catalog/entities/Order";
import { MemoryOrderQuoteRepository } from "../../infrastructure/catalog/MemoryOrderQuoteRepository";
import { CreateOrderFromQuoteUseCase } from "./CreateOrderFromQuoteUseCase";

const customer: Customer = {
    customerId: "customer-1",
    username: "ali",
    phone: "09120000000",
    nationalId: "0012345678",
    firstName: "Ali",
    lastName: "Test",
    passwordHash: "hash",
    passwordSalt: "salt",
    createdAt: "2026-09-07T06:00:00.000Z",
    updatedAt: "2026-09-07T06:00:00.000Z",
};

const quote = {
    quoteId: "quote-race",
    createdAt: "2026-09-07T06:00:00.000Z",
    market: {
        gold18Price: 23_549_000,
        currencyPrice: 1_000_000,
        ouncePrice: 4_000,
        updatedAt: "2026-09-07T06:00:00.000Z",
    },
    items: [{
        productId: "8",
        variantId: "default-standard",
        sku: "WG-0008",
        name: "آویز ستاره",
        quantity: 1,
        weightGrams: 1.2,
        unitPrice: 32_051_131,
        lineTotal: 32_051_131,
    }],
    total: 32_051_131,
};

describe("CreateOrderFromQuoteUseCase race safety", () => {
    it("returns the winning order when the database rejects a concurrent duplicate quote insert", async () => {
        const quoteRepository = new MemoryOrderQuoteRepository();
        await quoteRepository.save(quote);

        const winningOrder: Order = {
            orderId: "winning-order",
            quoteId: quote.quoteId,
            customerId: customer.customerId,
            address: null,
            status: "pending_confirmation",
            createdAt: "2026-09-08T06:00:00.000Z",
            updatedAt: "2026-09-08T06:00:00.000Z",
            market: { ...quote.market },
            items: quote.items.map((item) => ({ ...item })),
            total: quote.total,
        };

        const orderRepository = {
            save: async () => {
                throw new Error("UNIQUE constraint failed: orders.quote_id");
            },
            updateStatus: async () => undefined,
            findById: async () => null,
            findByQuoteId: async () => winningOrder,
            findByCustomerId: async () => [],
            findAll: async () => [],
        };
        const customerRepository = {
            findById: async (customerId: string) => customerId === customer.customerId ? customer : null,
            findByPhone: async () => null,
            findByUsername: async () => null,
            findByNationalId: async () => null,
            save: async () => undefined,
            listAddresses: async () => [],
            saveAddress: async () => undefined,
            setDefaultAddress: async () => undefined,
            deleteAddress: async () => undefined,
        };
        const useCase = new CreateOrderFromQuoteUseCase(quoteRepository, orderRepository, customerRepository);

        await expect(useCase.execute({
            quoteId: quote.quoteId,
            customerId: customer.customerId,
        })).resolves.toEqual(winningOrder);
    });
});
