import type { WishlistItem } from "../../domain/customer/entities/WishlistItem";
import type { WishlistRepository } from "../../domain/customer/repositories/WishlistRepository";

export class D1WishlistRepository implements WishlistRepository {
    constructor(private readonly db: D1Database) {}

    async listByCustomerId(customerId: string): Promise<WishlistItem[]> {
        const rows = await this.db.prepare(
            `SELECT customer_id, product_id, created_at, updated_at
             FROM customer_wishlist
             WHERE customer_id = ?1
             ORDER BY created_at DESC`
        ).bind(customerId).all<WishlistRow>();
        return rows.results.map((row) => this.toDomain(row));
    }

    async find(customerId: string, productId: string): Promise<WishlistItem | null> {
        const row = await this.db.prepare(
            `SELECT customer_id, product_id, created_at, updated_at
             FROM customer_wishlist
             WHERE customer_id = ?1 AND product_id = ?2
             LIMIT 1`
        ).bind(customerId, productId).first<WishlistRow>();
        return row ? this.toDomain(row) : null;
    }

    async add(item: WishlistItem): Promise<void> {
        await this.db.prepare(
            `INSERT OR IGNORE INTO customer_wishlist
                (customer_id, product_id, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4)`
        ).bind(item.customerId, item.productId, item.createdAt, item.updatedAt).run();
    }

    async remove(customerId: string, productId: string): Promise<boolean> {
        const result = await this.db.prepare(
            `DELETE FROM customer_wishlist WHERE customer_id = ?1 AND product_id = ?2`
        ).bind(customerId, productId).run();
        return Boolean(result.meta.changes);
    }

    private toDomain(row: WishlistRow): WishlistItem {
        return {
            customerId: row.customer_id,
            productId: row.product_id,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
}

type WishlistRow = {
    customer_id: string;
    product_id: string;
    created_at: string;
    updated_at: string;
};
