import type { ProductRepository } from "../../domain/catalog/repositories/ProductRepository";
import type { WishlistItem } from "../../domain/customer/entities/WishlistItem";
import type { WishlistRepository } from "../../domain/customer/repositories/WishlistRepository";

export class AddWishlistItemUseCase {
    constructor(
        private readonly wishlistRepository: WishlistRepository,
        private readonly productRepository: ProductRepository,
    ) {}

    async execute(input: { customerId: string; productId: string }): Promise<WishlistItem> {
        const productId = input.productId.trim();
        if (!productId) throw new Error("شناسه محصول الزامی است.");

        const product = await this.productRepository.findById(productId);
        if (!product || !product.active) throw new Error("محصول پیدا نشد.");

        const existing = await this.wishlistRepository.find(input.customerId, productId);
        if (existing) return existing;

        const now = new Date().toISOString();
        const item: WishlistItem = {
            customerId: input.customerId,
            productId,
            createdAt: now,
            updatedAt: now,
        };
        await this.wishlistRepository.add(item);
        return item;
    }
}
