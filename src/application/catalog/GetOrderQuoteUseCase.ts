import type { OrderQuote } from "../../domain/catalog/entities/OrderQuote";
import type { OrderQuoteRepository } from "../../domain/catalog/repositories/OrderQuoteRepository";

export class GetOrderQuoteUseCase {
    constructor(private readonly orderQuoteRepository: OrderQuoteRepository) {}

    async execute(quoteId: string): Promise<OrderQuote | null> {
        const normalizedQuoteId = String(quoteId).trim();
        if (!normalizedQuoteId) {
            throw new Error("شناسه پیش‌فاکتور معتبر نیست.");
        }

        return this.orderQuoteRepository.findById(normalizedQuoteId);
    }
}
