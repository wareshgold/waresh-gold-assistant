import type { GetProductUseCase } from "../../application/catalog/GetProductUseCase";
import type { GetProductsUseCase } from "../../application/catalog/GetProductsUseCase";

export class CatalogController {
    constructor(
        private readonly getProductsUseCase: GetProductsUseCase,
        private readonly getProductUseCase: GetProductUseCase,
    ) {}

    async list() {
        return this.getProductsUseCase.execute();
    }

    async get(productId: string) {
        return this.getProductUseCase.execute(productId);
    }
}