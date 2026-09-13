import type { WishlistItem } from "../entities/WishlistItem";

export interface WishlistRepository {
    listByCustomerId(customerId: string): Promise<WishlistItem[]>;
    find(customerId: string, productId: string): Promise<WishlistItem | null>;
    add(item: WishlistItem): Promise<void>;
    remove(customerId: string, productId: string): Promise<boolean>;
}
