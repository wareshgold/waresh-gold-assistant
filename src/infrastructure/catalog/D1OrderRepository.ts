import type { Order, OrderStatus } from "../../domain/catalog/entities/Order";
import type { OrderRepository } from "../../domain/catalog/repositories/OrderRepository";

export class D1OrderRepository implements OrderRepository {
    constructor(private readonly db: D1Database) {}

    async save(order: Order): Promise<void> {
        await this.db.batch([
            this.db.prepare(
                `INSERT INTO orders
                    (order_id, quote_id, customer_id, address_id, address_title, address_recipient_name, address_phone, address_province, address_city, address, address_postal_code, status, created_at, updated_at, gold18_price, currency_price, ounce_price, market_updated_at, total)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19)`
            ).bind(
                order.orderId, order.quoteId, order.customerId,
                order.address?.addressId ?? null, order.address?.title ?? null,
                order.address?.recipientName ?? null, order.address?.phone ?? null,
                order.address?.province ?? null, order.address?.city ?? null,
                order.address?.address ?? null, order.address?.postalCode ?? null,
                order.status, order.createdAt, order.updatedAt,
                order.market.gold18Price, order.market.currencyPrice,
                order.market.ouncePrice, order.market.updatedAt, order.total,
            ),
            ...order.items.map((item) => this.db.prepare(
                `INSERT INTO order_items
                    (order_id, product_id, variant_id, sku, name, quantity, weight_grams, unit_price, line_total)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`
            ).bind(order.orderId, item.productId, item.variantId, item.sku, item.name, item.quantity, item.weightGrams, item.unitPrice, item.lineTotal)),
        ]);
    }

    async updateStatus(orderId: string, status: OrderStatus, updatedAt: string): Promise<void> {
        const result = await this.db.prepare(
            `UPDATE orders SET status = ?1, updated_at = ?2 WHERE order_id = ?3`
        ).bind(status, updatedAt, orderId).run();
        if (!result.meta.changes) throw new Error("سفارش پیدا نشد.");
    }

    async findById(orderId: string): Promise<Order | null> {
        return this.findOne("order_id", orderId);
    }

    async findByQuoteId(quoteId: string): Promise<Order | null> {
        return this.findOne("quote_id", quoteId);
    }

    async findByCustomerId(customerId: string): Promise<Order[]> {
        const rows = await this.db.prepare(
            `SELECT order_id FROM orders WHERE customer_id = ?1 ORDER BY created_at DESC`
        ).bind(customerId).all<{ order_id: string }>();
        return this.loadOrders(rows.results.map((row) => row.order_id));
    }

    async findAll(): Promise<Order[]> {
        const rows = await this.db.prepare(
            `SELECT order_id FROM orders ORDER BY created_at DESC`
        ).all<{ order_id: string }>();
        return this.loadOrders(rows.results.map((row) => row.order_id));
    }

    private async loadOrders(orderIds: string[]): Promise<Order[]> {
        const orders: Order[] = [];
        for (const orderId of orderIds) {
            const order = await this.findOne("order_id", orderId);
            if (order) orders.push(order);
        }
        return orders;
    }

    private async findOne(field: "order_id" | "quote_id", value: string): Promise<Order | null> {
        const orderRow = await this.db.prepare(
            `SELECT order_id, quote_id, customer_id, address_id, address_title, address_recipient_name, address_phone, address_province, address_city, address, address_postal_code, status, created_at, updated_at, gold18_price, currency_price, ounce_price, market_updated_at, total
             FROM orders WHERE ${field} = ?1 LIMIT 1`
        ).bind(value).first<OrderRow>();
        if (!orderRow) return null;

        const itemRows = await this.db.prepare(
            `SELECT product_id, variant_id, sku, name, quantity, weight_grams, unit_price, line_total
             FROM order_items WHERE order_id = ?1 ORDER BY id`
        ).bind(orderRow.order_id).all<OrderItemRow>();

        const hasAddress = Boolean(orderRow.address_id);
        return {
            orderId: orderRow.order_id, quoteId: orderRow.quote_id, customerId: orderRow.customer_id,
            address: hasAddress ? {
                addressId: orderRow.address_id as string, title: orderRow.address_title ?? "",
                recipientName: orderRow.address_recipient_name ?? "", phone: orderRow.address_phone ?? "",
                province: orderRow.address_province ?? "", city: orderRow.address_city ?? "",
                address: orderRow.address ?? "", postalCode: orderRow.address_postal_code ?? "",
            } : null,
            status: orderRow.status as OrderStatus, createdAt: orderRow.created_at, updatedAt: orderRow.updated_at,
            market: {
                gold18Price: Number(orderRow.gold18_price), currencyPrice: Number(orderRow.currency_price),
                ouncePrice: orderRow.ounce_price === null ? null : Number(orderRow.ounce_price),
                updatedAt: orderRow.market_updated_at,
            },
            items: itemRows.results.map((row) => ({
                productId: row.product_id, variantId: row.variant_id, sku: row.sku, name: row.name,
                quantity: Number(row.quantity), weightGrams: Number(row.weight_grams),
                unitPrice: Number(row.unit_price), lineTotal: Number(row.line_total),
            })),
            total: Number(orderRow.total),
        };
    }
}

type OrderRow = {
    order_id: string; quote_id: string; customer_id: string | null; address_id: string | null;
    address_title: string | null; address_recipient_name: string | null; address_phone: string | null;
    address_province: string | null; address_city: string | null; address: string | null;
    address_postal_code: string | null; status: string; created_at: string; updated_at: string;
    gold18_price: number; currency_price: number; ounce_price: number | null;
    market_updated_at: string; total: number;
};

type OrderItemRow = {
    product_id: string; variant_id: string; sku: string; name: string; quantity: number;
    weight_grams: number; unit_price: number; line_total: number;
};
