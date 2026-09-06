import type { Product } from "../entities/Product";

export interface ProductRepository {
    listActive(): Promise<Product[]>;
    findById(productId: string): Promise<Product | null>;
}