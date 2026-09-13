import type { AppEnv } from "../../shared/config/env";
import type { ProductRepository } from "../../domain/catalog/repositories/ProductRepository";
import { D1ProductRepository } from "../../infrastructure/catalog/D1ProductRepository";
import { MemoryProductRepository } from "../../infrastructure/catalog/MemoryProductRepository";
import { GetProductUseCase } from "../../application/catalog/GetProductUseCase";
import { GetProductsUseCase } from "../../application/catalog/GetProductsUseCase";
import type { WishlistRepository } from "../../domain/customer/repositories/WishlistRepository";
import { D1WishlistRepository } from "../../infrastructure/customer/D1WishlistRepository";
import { MemoryWishlistRepository } from "../../infrastructure/customer/MemoryWishlistRepository";
import { AddWishlistItemUseCase } from "../../application/customer/AddWishlistItemUseCase";
import { ListWishlistUseCase } from "../../application/customer/ListWishlistUseCase";
import { RemoveWishlistItemUseCase } from "../../application/customer/RemoveWishlistItemUseCase";

export function createCatalogModule(env: AppEnv) {
    const productRepository: ProductRepository = env.waresh_gold_db
        ? new D1ProductRepository(env.waresh_gold_db)
        : new MemoryProductRepository();

    const wishlistRepository: WishlistRepository = env.waresh_gold_db
        ? new D1WishlistRepository(env.waresh_gold_db)
        : new MemoryWishlistRepository();

    return {
        productRepository,
        getProductsUseCase: new GetProductsUseCase(productRepository),
        getProductUseCase: new GetProductUseCase(productRepository),
        wishlistRepository,
        addWishlistItemUseCase: new AddWishlistItemUseCase(wishlistRepository, productRepository),
        listWishlistUseCase: new ListWishlistUseCase(wishlistRepository, productRepository),
        removeWishlistItemUseCase: new RemoveWishlistItemUseCase(wishlistRepository, productRepository),
    };
}
