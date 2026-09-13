import { describe, expect, it } from "vitest";
import { AddWishlistItemUseCase } from "./AddWishlistItemUseCase";
import { ListWishlistUseCase } from "./ListWishlistUseCase";
import { RemoveWishlistItemUseCase } from "./RemoveWishlistItemUseCase";
import { MemoryWishlistRepository } from "../../infrastructure/customer/MemoryWishlistRepository";
import type { Product } from "../../domain/catalog/entities/Product";
import type { ProductRepository } from "../../domain/catalog/repositories/ProductRepository";

const product: Product = {
    productId: "p-1",
    sku: "SKU-1",
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
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
};

function productRepository(overrides: Partial<ProductRepository> = {}): ProductRepository {
    return {
        listActive: async () => [product],
        findById: async (productId) => productId === product.productId ? product : null,
        ...overrides,
    };
}

describe("Wishlist use cases", () => {
    it("adds a valid product and is idempotent", async () => {
        const repository = new MemoryWishlistRepository();
        const useCase = new AddWishlistItemUseCase(repository, productRepository());

        const first = await useCase.execute({ customerId: "c-1", productId: "p-1" });
        const second = await useCase.execute({ customerId: "c-1", productId: "p-1" });

        expect(second).toEqual(first);
        expect(await repository.listByCustomerId("c-1")).toHaveLength(1);
    });

    it("rejects inactive or missing products", async () => {
        const repository = new MemoryWishlistRepository();
        const useCase = new AddWishlistItemUseCase(repository, productRepository({ findById: async () => null }));
        await expect(useCase.execute({ customerId: "c-1", productId: "missing" })).rejects.toThrow("محصول پیدا نشد.");
    });

    it("keeps wishlist ownership isolated", async () => {
        const repository = new MemoryWishlistRepository();
        const add = new AddWishlistItemUseCase(repository, productRepository());
        const list = new ListWishlistUseCase(repository, productRepository());
        await add.execute({ customerId: "c-1", productId: "p-1" });
        expect(await list.execute("c-2")).toEqual([]);
        expect(await list.execute("c-1")).toHaveLength(1);
    });

    it("removes only the authenticated customer's item", async () => {
        const repository = new MemoryWishlistRepository();
        const add = new AddWishlistItemUseCase(repository, productRepository());
        const remove = new RemoveWishlistItemUseCase(repository, productRepository());
        await add.execute({ customerId: "c-1", productId: "p-1" });
        await add.execute({ customerId: "c-2", productId: "p-1" });
        await remove.execute({ customerId: "c-1", productId: "p-1" });
        expect(await repository.find("c-1", "p-1")).toBeNull();
        expect(await repository.find("c-2", "p-1")).not.toBeNull();
    });
});
