import { describe, expect, it } from "vitest";
import { GetProductUseCase } from "./GetProductUseCase";
import { GetProductsUseCase } from "./GetProductsUseCase";
import { MemoryProductRepository } from "../../infrastructure/catalog/MemoryProductRepository";

describe("Catalog use cases", () => {
    const repository = new MemoryProductRepository();

    it("lists active products", async () => {
        const products = await new GetProductsUseCase(repository).execute();
        expect(products).toHaveLength(22);
        expect(products.every((product) => product.active)).toBe(true);
    });

    it("returns a product by id", async () => {
        const product = await new GetProductUseCase(repository).execute("1");
        expect(product?.productId).toBe("1");
        expect(product?.sku).toBe("WG-0001");
    });

    it("returns null for an unknown product", async () => {
        await expect(new GetProductUseCase(repository).execute("999")).resolves.toBeNull();
    });
});