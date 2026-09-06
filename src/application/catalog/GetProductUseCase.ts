import type { Product } from "../../domain/catalog/entities/Product";
import type { ProductRepository } from "../../domain/catalog/repositories/ProductRepository";

export class GetProductUseCase {
    constructor(private readonly productRepository: ProductRepository) {}

    execute(productId: string): Promise<Product | null> {
        return this.productRepository.findById(productId);
    }
}