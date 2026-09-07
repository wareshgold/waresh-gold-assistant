import type { OrderQuote } from "../../domain/catalog/entities/OrderQuote";
import type { OrderQuoteRepository } from "../../domain/catalog/repositories/OrderQuoteRepository";

export class MemoryOrderQuoteRepository implements OrderQuoteRepository {
    private readonly quotes = new Map<string, OrderQuote>();

    async save(quote: OrderQuote): Promise<void> {
        this.quotes.set(quote.quoteId, quote);
    }

    async findById(quoteId: string): Promise<OrderQuote | null> {
        return this.quotes.get(quoteId) ?? null;
    }
}
