import type { AppEnv } from "../../shared/config/env";
import type { ProductRepository } from "../../domain/catalog/repositories/ProductRepository";
import { D1ProductRepository } from "../../infrastructure/catalog/D1ProductRepository";
import { MemoryProductRepository } from "../../infrastructure/catalog/MemoryProductRepository";
import { GetProductUseCase } from "../../application/catalog/GetProductUseCase";
import { GetProductsUseCase } from "../../application/catalog/GetProductsUseCase";

export function createCatalogModule(env: AppEnv) {
    const productRepository: ProductRepository = env.waresh_gold_db
        ? new D1ProductRepository(env.waresh_gold_db)
        : new MemoryProductRepository();

    return {
        productRepository,
        getProductsUseCase: new GetProductsUseCase(productRepository),
        getProductUseCase: new GetProductUseCase(productRepository),
    };
}