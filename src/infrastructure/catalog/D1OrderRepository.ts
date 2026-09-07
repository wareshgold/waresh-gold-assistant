import type { Order, OrderStatus } from "../../domain/catalog/entities/Order";
import type { OrderRepository } from "../../domain/catalog/repositories/OrderRepository";

export class D1OrderRepository implements OrderRepository {
    constructor(private readonly db: D1Database) {}

    async save(order: Order): Promise<void> {
        await this.db.batch([
            this.db.prepare(
                `INSERT INTO orders
                    (order_id, quote_id, customer_id, status, created_at, updated_at, gold18_price, currency_price, ounce_price, market_updated_at, total)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)`
            ).bind(
                order.orderId,
                order.quoteId,
                order.customerId,
                order.status,
                order.createdAt,
                order.updatedAt,
                order.market.gold18Price,
                order.market.currencyPrice,
                order.market.ouncePrice,
                order.market.updatedAt,
                order.total,
            ),
            ...order.items.map((item) => this.db.prepare(
                `INSERT INTO order_items
                    (order_id, product_id, variant_id, sku, name, quantity, weight_grams, unit_price, line_total)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`
            ).bind(
                order.orderId,
                item.productId,
                item.variantId,
                item.sku,
                item.name,
                item.quantity,
                item.weightGrams,
                item.unitPrice,
                item.lineTotal,
            )),
        ]);
    }

    async findById(orderId: string): Promise<Order | null> {
        return this.findOne("order_id", orderId);
    }

    async findByQuoteId(quoteId: string): Promise<Order | null> {
        return this.findOne("quote_id", quoteId);
    }

    private async findOne(field: "order_id" | "quote_id", value: string): Promise<Order | null> {
        const orderRow = await this.db.prepare(
            `SELECT order_id, quote_id, customer_id, status, created_at, updated_at, gold18_price, currency_price, ounce_price, market_updated_at, total
             FROM orders WHERE ${field} = ?1 LIMIT 1`
        ).bind(value).first<OrderRow>();

        if (!orderRow) return null;

        const itemRows = await this.db.prepare(
            `SELECT product_id, variant_id, sku, name, quantity, weight_grams, unit_price, line_total
             FROM order_items WHERE order_id = ?1 ORDER BY id`
        ).bind(orderRow.order_id).all<OrderItemRow>();

        return {
            orderId: orderRow.order_id,
            quoteId: orderRow.quote_id,
            customerId: orderRow.customer_id,
            status: orderRow.status as OrderStatus,
            createdAt: orderRow.created_at,
            updatedAt: orderRow.updated_at,
            market: {
                gold18Price: Number(orderRow.gold18_price),
                currencyPrice: Number(orderRow.currency_price),
                ouncePrice: orderRow.ounce_price === null ? null : Number(orderRow.ounce_price),
                updatedAt: orderRow.market_updated_at,
            },
            items: itemRows.results.map((row) => ({
                productId: row.product_id,
                variantId: row.variant_id,
                sku: row.sku,
                name: row.name,
                quantity: Number(row.quantity),
                weightGrams: Number(row.weight_grams),
                unitPrice: Number(row.unit_price),
                lineTotal: Number(row.line_total),
            })),
            total: Number(orderRow.total),
        };
    }
}

type OrderRow = {
    order_id: string;
    quote_id: string;
    customer_id: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    gold18_price: number;
    currency_price: number;
    ounce_price: number | null;
    market_updated_at: string;
    total: number;
};

type OrderItemRow = {
    product_id: string;
    variant_id: string;
    sku: string;
    name: string;
    quantity: number;
    weight_grams: number;
    unit_price: number;
    line_total: number;
};
