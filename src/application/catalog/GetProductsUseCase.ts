import type { Product } from "../../domain/catalog/entities/Product";
import type { ProductRepository } from "../../domain/catalog/repositories/ProductRepository";

export class GetProductsUseCase {
    constructor(private readonly productRepository: ProductRepository) {}

    execute(): Promise<Product[]> {
        return this.productRepository.listActive();
    }
}