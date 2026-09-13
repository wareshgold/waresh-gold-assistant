import type { ProductRepository } from "../../domain/catalog/repositories/ProductRepository";
import type { WishlistItem } from "../../domain/customer/entities/WishlistItem";
import type { WishlistRepository } from "../../domain/customer/repositories/WishlistRepository";

export type WishlistProductItem = WishlistItem & {
    product: Awaited<ReturnType<ProductRepository["findById"]>>;
};

export class ListWishlistUseCase {
    constructor(
        private readonly wishlistRepository: WishlistRepository,
        private readonly productRepository: ProductRepository,
    ) {}

    async execute(customerId: string): Promise<WishlistProductItem[]> {
        const items = await this.wishlistRepository.listByCustomerId(customerId);
        const result: WishlistProductItem[] = [];
        for (const item of items) {
            const product = await this.productRepository.findById(item.productId);
            if (product?.active) result.push({ ...item, product });
        }
        return result;
    }
}
