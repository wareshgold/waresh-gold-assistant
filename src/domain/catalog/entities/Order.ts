import type { OrderQuoteLine, OrderQuoteMarketSnapshot } from "./OrderQuote";

export type OrderStatus =
    | "pending_confirmation"
    | "confirmed"
    | "paid"
    | "processing"
    | "completed"
    | "cancelled"
    | "expired";

export type OrderAddressSnapshot = {
    addressId: string;
    title: string;
    recipientName: string;
    phone: string;
    province: string;
    city: string;
    address: string;
    postalCode: string;
};

export type Order = {
    orderId: string;
    quoteId: string;
    customerId: string | null;
    address: OrderAddressSnapshot | null;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
    market: OrderQuoteMarketSnapshot;
    items: OrderQuoteLine[];
    total: number;
};
