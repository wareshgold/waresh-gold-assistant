import type { OrderQuoteLine, OrderQuoteMarketSnapshot } from "./OrderQuote";

export type OrderStatus =
    | "pending_confirmation"
    | "confirmed"
    | "paid"
    | "processing"
    | "completed"
    | "cancelled"
    | "expired";

export type Order = {
    orderId: string;
    quoteId: string;
    customerId: string | null;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
    market: OrderQuoteMarketSnapshot;
    items: OrderQuoteLine[];
    total: number;
};
