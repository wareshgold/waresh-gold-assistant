import type { CustomerRepository } from "../../domain/customer/repositories/CustomerRepository";
import type { Order } from "../../domain/catalog/entities/Order";
import type { OrderQuote } from "../../domain/catalog/entities/OrderQuote";
import type { OrderQuoteRepository } from "../../domain/catalog/repositories/OrderQuoteRepository";

type OrderCreationRepository = {
    save(order: Order): Promise<void>;
    findByQuoteId(quoteId: string): Promise<Order | null>;
};

export class CreateOrderFromQuoteUseCase {
    constructor(
        private readonly quoteRepository: OrderQuoteRepository,
        private readonly orderRepository: OrderCreationRepository,
        private readonly customerRepository: CustomerRepository,
    ) {}

    async execute(input: { quoteId: string; customerId?: string; addressId?: string }): Promise<Order> {
        const normalizedQuoteId = input?.quoteId?.trim();
        if (!normalizedQuoteId) throw new Error("شناسه پیش‌فاکتور الزامی است.");

        const customerId = input.customerId?.trim() || null;
        const requestedAddressId = input.addressId?.trim() || null;

        if (customerId) {
            const customer = await this.customerRepository.findById(customerId);
            if (!customer) throw new Error("حساب کاربری پیدا نشد.");
        } else if (requestedAddressId) {
            throw new Error("برای استفاده از آدرس باید وارد حساب کاربری شوید.");
        }

        const existing = await this.orderRepository.findByQuoteId(normalizedQuoteId);
        if (existing) return validateExistingOrder(existing, customerId, requestedAddressId);

        const quote = await this.quoteRepository.findById(normalizedQuoteId);
        if (!quote) throw new Error("پیش‌فاکتور پیدا نشد.");

        let address: Order["address"] = null;
        if (customerId) {
            const addresses = await this.customerRepository.listAddresses(customerId);
            const ownedAddress = requestedAddressId
                ? addresses.find((item) => item.id === requestedAddressId)
                : addresses.find((item) => item.isDefault) ?? addresses[0];

            if (requestedAddressId && !ownedAddress) throw new Error("آدرس انتخاب‌شده پیدا نشد.");
            if (ownedAddress) {
                address = {
                    addressId: ownedAddress.id,
                    title: ownedAddress.title,
                    recipientName: ownedAddress.recipientName,
                    phone: ownedAddress.phone,
                    province: ownedAddress.province,
                    city: ownedAddress.city,
                    address: ownedAddress.address,
                    postalCode: ownedAddress.postalCode,
                };
            }
        }

        const now = new Date().toISOString();
        const order: Order = {
            orderId: crypto.randomUUID(),
            quoteId: quote.quoteId,
            customerId,
            address,
            status: "pending_confirmation",
            createdAt: now,
            updatedAt: now,
            market: cloneMarket(quote),
            items: quote.items.map((item) => ({ ...item })),
            total: quote.total,
        };

        try {
            await this.orderRepository.save(order);
        } catch (error) {
            if (!isQuoteUniqueConstraintError(error)) throw error;

            const racedOrder = await this.orderRepository.findByQuoteId(normalizedQuoteId);
            if (!racedOrder) throw error;

            return validateExistingOrder(racedOrder, customerId, requestedAddressId);
        }

        return order;
    }
}

function validateExistingOrder(order: Order, customerId: string | null, addressId: string | null): Order {
    if (customerId && order.customerId !== customerId) {
        throw new Error("این پیش‌فاکتور قبلاً به حساب کاربری دیگری ثبت شده است.");
    }
    if (customerId && addressId && order.address?.addressId !== addressId) {
        throw new Error("این پیش‌فاکتور قبلاً با آدرس دیگری ثبت شده است.");
    }
    return order;
}

function isQuoteUniqueConstraintError(error: unknown): boolean {
    if (!(error instanceof Error)) return false;
    const message = error.message.toLowerCase();
    return message.includes("unique constraint") && message.includes("quote_id");
}

function cloneMarket(quote: OrderQuote) {
    return { ...quote.market };
}
