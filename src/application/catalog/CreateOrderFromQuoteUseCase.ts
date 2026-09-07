import type { CustomerRepository } from "../../domain/customer/repositories/CustomerRepository";
import type { Order } from "../../domain/catalog/entities/Order";
import type { OrderQuote } from "../../domain/catalog/entities/OrderQuote";
import type { OrderRepository } from "../../domain/catalog/repositories/OrderRepository";
import type { OrderQuoteRepository } from "../../domain/catalog/repositories/OrderQuoteRepository";

export class CreateOrderFromQuoteUseCase {
    constructor(
        private readonly quoteRepository: OrderQuoteRepository,
        private readonly orderRepository: OrderRepository,
        private readonly customerRepository: CustomerRepository,
    ) {}

    async execute(input: { quoteId: string; customerId?: string }): Promise<Order> {
        const normalizedQuoteId = input?.quoteId?.trim();
        if (!normalizedQuoteId) throw new Error("شناسه پیش‌فاکتور الزامی است.");

        const customerId = input.customerId?.trim() || null;
        if (customerId) {
            const customer = await this.customerRepository.findById(customerId);
            if (!customer) throw new Error("حساب کاربری پیدا نشد.");
        }

        const existing = await this.orderRepository.findByQuoteId(normalizedQuoteId);
        if (existing) {
            if (customerId && existing.customerId !== customerId) {
                throw new Error("این پیش‌فاکتور قبلاً به حساب کاربری دیگری ثبت شده است.");
            }
            return existing;
        }

        const quote = await this.quoteRepository.findById(normalizedQuoteId);
        if (!quote) throw new Error("پیش‌فاکتور پیدا نشد.");

        const now = new Date().toISOString();
        const order: Order = {
            orderId: crypto.randomUUID(),
            quoteId: quote.quoteId,
            customerId,
            status: "pending_confirmation",
            createdAt: now,
            updatedAt: now,
            market: cloneMarket(quote),
            items: quote.items.map((item) => ({ ...item })),
            total: quote.total,
        };

        await this.orderRepository.save(order);
        return order;
    }
}

function cloneMarket(quote: OrderQuote) {
    return { ...quote.market };
}
