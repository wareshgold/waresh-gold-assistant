import type { Product, ProductStockStatus } from "../../domain/catalog/entities/Product";
import type { ProductRepository } from "../../domain/catalog/repositories/ProductRepository";

type ProductRow = {
    product_id: string;
    sku: string;
    name: string;
    category: string;
    subcategory: string | null;
    weight_grams: number;
    karat: number;
    labor_percent: number;
    profit_percent: number;
    tax_percent: number;
    stock_status: ProductStockStatus;
    active: number;
    created_at: string;
    updated_at: string;
};

function mapProduct(row: ProductRow): Product {
    return {
        productId: row.product_id,
        sku: row.sku,
        name: row.name,
        category: row.category,
        subcategory: row.subcategory,
        weightGrams: Number(row.weight_grams),
        karat: row.karat === 24 ? 24 : 18,
        laborPercent: Number(row.labor_percent),
        profitPercent: Number(row.profit_percent),
        taxPercent: Number(row.tax_percent),
        stockStatus: row.stock_status,
        active: Boolean(row.active),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export class D1ProductRepository implements ProductRepository {
    constructor(private readonly db: D1Database) {}

    async listActive(): Promise<Product[]> {
        const result = await this.db
            .prepare("SELECT * FROM products WHERE active = 1 ORDER BY product_id")
            .all<ProductRow>();
        return result.results.map(mapProduct);
    }

    async findById(productId: string): Promise<Product | null> {
        const row = await this.db
            .prepare("SELECT * FROM products WHERE product_id = ? AND active = 1 LIMIT 1")
            .bind(productId)
            .first<ProductRow>();
        return row ? mapProduct(row) : null;
    }
}