import type { AppEnv } from "../../shared/config/env";
import type { WishlistRepository } from "../../domain/customer/repositories/WishlistRepository";
import { D1WishlistRepository } from "../../infrastructure/customer/D1WishlistRepository";
import { MemoryWishlistRepository } from "../../infrastructure/customer/MemoryWishlistRepository";
import { AddWishlistItemUseCase } from "../../application/customer/AddWishlistItemUseCase";
import { ListWishlistUseCase } from "../../application/customer/ListWishlistUseCase";
import { RemoveWishlistItemUseCase } from "../../application/customer/RemoveWishlistItemUseCase";

export function createWishlistModule(env: AppEnv, productRepository: import("../../domain/catalog/repositories/ProductRepository").ProductRepository) {
    const wishlistRepository: WishlistRepository = env.waresh_gold_db
        ? new D1WishlistRepository(env.waresh_gold_db)
        : new MemoryWishlistRepository();

    return {
        wishlistRepository,
        addWishlistItemUseCase: new AddWishlistItemUseCase(wishlistRepository, productRepository),
        listWishlistUseCase: new ListWishlistUseCase(wishlistRepository, productRepository),
        removeWishlistItemUseCase: new RemoveWishlistItemUseCase(wishlistRepository, productRepository),
    };
}
