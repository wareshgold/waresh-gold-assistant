import { describe, expect, it } from "vitest";
import type { OrderQuote } from "../../domain/catalog/entities/OrderQuote";
import { MemoryOrderQuoteRepository } from "../../infrastructure/catalog/MemoryOrderQuoteRepository";
import { MemoryOrderRepository } from "../../infrastructure/catalog/MemoryOrderRepository";
import { CreateOrderFromQuoteUseCase } from "./CreateOrderFromQuoteUseCase";

const quote: OrderQuote = {
    quoteId: "quote-1",
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
        quantity: 2,
        weightGrams: 1.2,
        unitPrice: 32_051_131,
        lineTotal: 64_102_262,
    }],
    total: 64_102_262,
};

function createUseCase() {
    const quoteRepository = new MemoryOrderQuoteRepository();
    const orderRepository = new MemoryOrderRepository();
    return { useCase: new CreateOrderFromQuoteUseCase(quoteRepository, orderRepository), quoteRepository, orderRepository };
}

describe("CreateOrderFromQuoteUseCase", () => {
    it("creates an order as an immutable snapshot of the persisted quote", async () => {
        const { useCase, quoteRepository, orderRepository } = createUseCase();
        await quoteRepository.save(quote);

        const order = await useCase.execute(quote.quoteId);

        expect(order.orderId).toBeTypeOf("string");
        expect(order.quoteId).toBe(quote.quoteId);
        expect(order.status).toBe("pending_confirmation");
        expect(order.market).toEqual(quote.market);
        expect(order.items).toEqual(quote.items);
        expect(order.total).toBe(quote.total);
        await expect(orderRepository.findById(order.orderId)).resolves.toEqual(order);
    });

    it("does not accept or calculate client-supplied prices", async () => {
        const { useCase, quoteRepository } = createUseCase();
        await quoteRepository.save(quote);

        const order = await useCase.execute(quote.quoteId);

        expect(order.total).toBe(quote.total);
        expect(order.items[0]?.unitPrice).toBe(quote.items[0]?.unitPrice);
    });

    it("rejects an unknown quote", async () => {
        const { useCase } = createUseCase();
        await expect(useCase.execute("missing")).rejects.toThrow("پیش‌فاکتور پیدا نشد");
    });

    it("is idempotent for the same quote", async () => {
        const { useCase, quoteRepository, orderRepository } = createUseCase();
        await quoteRepository.save(quote);

        const first = await useCase.execute(quote.quoteId);
        const second = await useCase.execute(quote.quoteId);

        expect(second).toEqual(first);
        expect(await orderRepository.findByQuoteId(quote.quoteId)).toEqual(first);
    });
});
