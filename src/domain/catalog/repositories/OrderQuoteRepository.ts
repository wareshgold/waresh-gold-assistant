import type { OrderQuote } from "../entities/OrderQuote";

export interface OrderQuoteRepository {
    save(quote: OrderQuote): Promise<void>;
    findById(quoteId: string): Promise<OrderQuote | null>;
}
