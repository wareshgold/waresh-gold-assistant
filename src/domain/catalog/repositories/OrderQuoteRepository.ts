import type { OrderQuote } from "../../application/catalog/CreateOrderQuoteUseCase";

export interface OrderQuoteRepository {
    save(quote: OrderQuote): Promise<void>;
    findById(quoteId: string): Promise<OrderQuote | null>;
}
