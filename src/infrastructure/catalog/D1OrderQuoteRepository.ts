import type { OrderQuote } from "../../domain/catalog/entities/OrderQuote";
import type { OrderQuoteRepository } from "../../domain/catalog/repositories/OrderQuoteRepository";

export class D1OrderQuoteRepository implements OrderQuoteRepository {
    constructor(private readonly db: D1Database) {}

    async save(quote: OrderQuote): Promise<void> {
        await this.db.batch([
            this.db.prepare(
                `INSERT INTO order_quotes
                    (quote_id, created_at, gold18_price, currency_price, ounce_price, market_updated_at, total)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`
            ).bind(
                quote.quoteId,
                quote.createdAt,
                quote.market.gold18Price,
                quote.market.currencyPrice,
                quote.market.ouncePrice,
                quote.market.updatedAt,
                quote.total,
            ),
            ...quote.items.map((item) => this.db.prepare(
                `INSERT INTO order_quote_items
                    (quote_id, product_id, variant_id, sku, name, quantity, weight_grams, unit_price, line_total)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`
            ).bind(
                quote.quoteId,
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

    async findById(quoteId: string): Promise<OrderQuote | null> {
        const quoteRow = await this.db.prepare(
            `SELECT quote_id, created_at, gold18_price, currency_price, ounce_price, market_updated_at, total
             FROM order_quotes WHERE quote_id = ?1 LIMIT 1`
        ).bind(quoteId).first<QuoteRow>();

        if (!quoteRow) return null;

        const itemRows = await this.db.prepare(
            `SELECT product_id, variant_id, sku, name, quantity, weight_grams, unit_price, line_total
             FROM order_quote_items WHERE quote_id = ?1 ORDER BY id`
        ).bind(quoteId).all<QuoteItemRow>();

        return {
            quoteId: quoteRow.quote_id,
            createdAt: quoteRow.created_at,
            market: {
                gold18Price: Number(quoteRow.gold18_price),
                currencyPrice: Number(quoteRow.currency_price),
                ouncePrice: quoteRow.ounce_price === null ? null : Number(quoteRow.ounce_price),
                updatedAt: quoteRow.market_updated_at,
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
            total: Number(quoteRow.total),
        };
    }
}

type QuoteRow = {
    quote_id: string;
    created_at: string;
    gold18_price: number;
    currency_price: number;
    ounce_price: number | null;
    market_updated_at: string;
    total: number;
};

type QuoteItemRow = {
    product_id: string;
    variant_id: string;
    sku: string;
    name: string;
    quantity: number;
    weight_grams: number;
    unit_price: number;
    line_total: number;
};
