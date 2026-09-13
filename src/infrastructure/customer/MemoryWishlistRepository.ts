import type { WishlistItem } from "../../domain/customer/entities/WishlistItem";
import type { WishlistRepository } from "../../domain/customer/repositories/WishlistRepository";

export class MemoryWishlistRepository implements WishlistRepository {
    private readonly items = new Map<string, WishlistItem>();

    async listByCustomerId(customerId: string): Promise<WishlistItem[]> {
        return [...this.items.values()]
            .filter((item) => item.customerId === customerId)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    async find(customerId: string, productId: string): Promise<WishlistItem | null> {
        return this.items.get(this.key(customerId, productId)) ?? null;
    }

    async add(item: WishlistItem): Promise<void> {
        const key = this.key(item.customerId, item.productId);
        if (this.items.has(key)) return;
        this.items.set(key, item);
    }

    async remove(customerId: string, productId: string): Promise<boolean> {
        return this.items.delete(this.key(customerId, productId));
    }

    private key(customerId: string, productId: string): string {
        return `${customerId}:${productId}`;
    }
}
