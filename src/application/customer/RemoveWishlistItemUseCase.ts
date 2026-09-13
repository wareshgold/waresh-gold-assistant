import type { ProductRepository } from "../../domain/catalog/repositories/ProductRepository";
import type { WishlistRepository } from "../../domain/customer/repositories/WishlistRepository";

export class RemoveWishlistItemUseCase {
    constructor(
        private readonly wishlistRepository: WishlistRepository,
        private readonly productRepository: ProductRepository,
    ) {}

    async execute(input: { customerId: string; productId: string }): Promise<void> {
        const productId = input.productId.trim();
        if (!productId) throw new Error("شناسه محصول الزامی است.");

        const product = await this.productRepository.findById(productId);
        if (!product) throw new Error("محصول پیدا نشد.");

        await this.wishlistRepository.remove(input.customerId, productId);
    }
}
