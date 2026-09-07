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
    market: OrderQuoteMarketSnapshot;
    items: OrderQuoteLine[];
    total: number;
};
