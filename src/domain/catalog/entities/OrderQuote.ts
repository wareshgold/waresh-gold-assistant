export type OrderQuoteLine = {
    productId: string;
    variantId: string;
    sku: string;
    name: string;
    quantity: number;
    weightGrams: number;
    unitPrice: number;
    lineTotal: number;
};

export type OrderQuoteMarketSnapshot = {
    gold18Price: number;
    currencyPrice: number;
    ouncePrice: number | null;
    updatedAt: string;
};

export type OrderQuote = {
    quoteId: string;
    createdAt: string;
    expiresAt: string;
    market: OrderQuoteMarketSnapshot;
    items: OrderQuoteLine[];
    total: number;
};

export const ORDER_QUOTE_TTL_MS = 5 * 60 * 1000;

export function isOrderQuoteExpired(quote: Pick<OrderQuote, "expiresAt">, now = new Date()): boolean {
    const expiresAt = Date.parse(quote.expiresAt);
    return !Number.isFinite(expiresAt) || expiresAt <= now.getTime();
}
