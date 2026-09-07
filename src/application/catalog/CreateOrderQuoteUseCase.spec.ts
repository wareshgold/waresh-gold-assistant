import { describe, expect, it } from "vitest";
import type { Product } from "../../domain/catalog/entities/Product";
import type { ProductRepository } from "../../domain/catalog/repositories/ProductRepository";
import type { MarketPriceProvider } from "../../domain/market/providers/MarketPriceProvider";
import { MemoryOrderQuoteRepository } from "../../infrastructure/catalog/MemoryOrderQuoteRepository";
import { CalculateGoldPriceUseCase } from "../gold/CalculateGoldPriceUseCase";
import { createGoldRuleEngine } from "../../domain/gold/services/createGoldRuleEngine";
import { CreateOrderQuoteUseCase } from "./CreateOrderQuoteUseCase";

const product: Product = {
    productId: "8",
    sku: "WG-0008",
    name: "آویز ستاره",
    category: "آویز",
    subcategory: null,
    weightGrams: 1.2,
    karat: 18,
    laborPercent: 6,
    profitPercent: 7,
    taxPercent: 0,
    stockStatus: "in-stock",
    active: true,
    createdAt: "2026-09-06T00:00:00.000Z",
    updatedAt: "2026-09-06T00:00:00.000Z",
};

const repository: ProductRepository = {
    listActive: async () => [product],
    findById: async (productId) => productId === product.productId ? product : null,
};

const marketProvider: MarketPriceProvider = {
    getCurrentPrice: async () => ({
        gold18Price: 23_549_000,
        currencyPrice: 1_000_000,
        ouncePrice: 4_000,
        updatedAt: new Date("2026-09-07T06:00:00.000Z"),
    }),
};

function createUseCase() {
    return new CreateOrderQuoteUseCase(
        repository,
        marketProvider,
        new CalculateGoldPriceUseCase(createGoldRuleEngine()),
        new MemoryOrderQuoteRepository(),
    );
}

describe("CreateOrderQuoteUseCase", () => {
    it("resolves products and calculates prices from the server market snapshot", async () => {
        const quote = await createUseCase().execute([
            { productId: "8", variantId: "default-standard", quantity: 2 },
        ]);

        expect(quote.quoteId).toBeTypeOf("string");
        expect(quote.market.gold18Price).toBe(23_549_000);
        expect(quote.items[0]?.unitPrice).toBe(32_051_131);
        expect(quote.items[0]?.lineTotal).toBe(64_102_262);
        expect(quote.total).toBe(64_102_262);
    });

    it("persists the immutable quote snapshot", async () => {
        const repository = new MemoryOrderQuoteRepository();
        const useCase = new CreateOrderQuoteUseCase(
            repository,
            marketProvider,
            new CalculateGoldPriceUseCase(createGoldRuleEngine()),
            repository,
        );

        const quote = await useCase.execute([
            { productId: "8", variantId: "default-standard", quantity: 1 },
        ]);

        await expect(repository.findById(quote.quoteId)).resolves.toEqual(quote);
    });

    it("rejects unavailable products", async () => {
        await expect(createUseCase().execute([
            { productId: "missing", variantId: "default-standard", quantity: 1 },
        ])).rejects.toThrow("محصول missing پیدا نشد");
    });
});
