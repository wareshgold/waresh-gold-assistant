import { describe, expect, it } from "vitest";
import { MemoryOrderQuoteRepository } from "../../infrastructure/catalog/MemoryOrderQuoteRepository";
import type { OrderQuote } from "../../domain/catalog/entities/OrderQuote";
import { GetOrderQuoteUseCase } from "./GetOrderQuoteUseCase";

describe("GetOrderQuoteUseCase", () => {
    it("retrieves the persisted immutable quote by id", async () => {
        const repository = new MemoryOrderQuoteRepository();
        const quote: OrderQuote = {
            quoteId: "quote-123",
            createdAt: "2026-09-07T07:00:00.000Z",
            market: {
                gold18Price: 23_549_000,
                currencyPrice: 1_000_000,
                ouncePrice: 4_000,
                updatedAt: "2026-09-07T06:59:00.000Z",
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
        await repository.save(quote);

        await expect(new GetOrderQuoteUseCase(repository).execute(" quote-123 ")).resolves.toEqual(quote);
    });

    it("returns null for an unknown quote", async () => {
        const repository = new MemoryOrderQuoteRepository();
        await expect(new GetOrderQuoteUseCase(repository).execute("missing")).resolves.toBeNull();
    });

    it("rejects an empty quote id", async () => {
        const repository = new MemoryOrderQuoteRepository();
        await expect(new GetOrderQuoteUseCase(repository).execute("   ")).rejects.toThrow("شناسه پیش‌فاکتور معتبر نیست");
    });
});
