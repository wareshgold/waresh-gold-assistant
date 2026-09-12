import { describe, expect, it } from "vitest";
import type { Customer } from "../../domain/customer/entities/Customer";
import type { CustomerAddress } from "../../domain/customer/entities/CustomerAddress";
import type { OrderQuote } from "../../domain/catalog/entities/OrderQuote";
import { MemoryOrderQuoteRepository } from "../../infrastructure/catalog/MemoryOrderQuoteRepository";
import { MemoryOrderRepository } from "../../infrastructure/catalog/MemoryOrderRepository";
import { CreateOrderFromQuoteUseCase } from "./CreateOrderFromQuoteUseCase";

const customer: Customer = {
    customerId: "customer-1",
    username: "ali",
    phone: "09120000000",
    nationalId: "0012345678",
    firstName: "Ali",
    lastName: "Test",
    passwordHash: "hash",
    passwordSalt: "salt",
    createdAt: "2026-09-07T06:00:00.000Z",
    updatedAt: "2026-09-07T06:00:00.000Z",
};

const customerAddress: CustomerAddress = {
    id: "address-1",
    customerId: customer.customerId,
    title: "خانه",
    recipientName: "Ali Test",
    phone: "09120000000",
    province: "تهران",
    city: "تهران",
    address: "خیابان نمونه، پلاک ۱",
    postalCode: "1234567890",
    isDefault: true,
    createdAt: "2026-09-07T06:00:00.000Z",
    updatedAt: "2026-09-07T06:00:00.000Z",
};

const foreignAddress: CustomerAddress = {
    ...customerAddress,
    id: "address-2",
    customerId: "customer-2",
    title: "آدرس شخص دیگر",
    isDefault: false,
};

const quote: OrderQuote = {
    quoteId: "quote-1",
    createdAt: "2026-09-07T06:00:00.000Z",
    market: {
        gold18Price: 23_549_000,
        currencyPrice: 1_000_000,
        ouncePrice: 4_000,
        updatedAt: "2026-09-07T06:00:00.000Z",
    },
    items: [{
        productId: "8",
        variantId: "default-standard",
        sku: "WG-0008",
        name: "آویز ستاره",
        quantity: 2,
        weightGrams: 1.2,
        unitPrice: 32_051_131,
        lineTotal: 64_102_262,
    }],
    total: 64_102_262,
};

function createUseCase(addresses: CustomerAddress[] = []) {
    const quoteRepository = new MemoryOrderQuoteRepository();
    const orderRepository = new MemoryOrderRepository();
    const customerRepository = {
        findById: async (customerId: string) => customerId === customer.customerId ? customer : null,
        findByPhone: async () => null,
        findByUsername: async () => null,
        findByNationalId: async () => null,
        save: async () => undefined,
        listAddresses: async (customerId: string) => addresses.filter((address) => address.customerId === customerId),
        saveAddress: async () => undefined,
        setDefaultAddress: async () => undefined,
        deleteAddress: async () => undefined,
    };
    return {
        useCase: new CreateOrderFromQuoteUseCase(quoteRepository, orderRepository, customerRepository),
        quoteRepository,
        orderRepository,
    };
}

describe("CreateOrderFromQuoteUseCase", () => {
    it("creates a guest order when no customer identity is supplied", async () => {
        const { useCase, quoteRepository } = createUseCase();
        await quoteRepository.save(quote);

        const order = await useCase.execute({ quoteId: quote.quoteId });

        expect(order.customerId).toBeNull();
    });

    it("attaches a validated customer identity to the order", async () => {
        const { useCase, quoteRepository, orderRepository } = createUseCase();
        await quoteRepository.save(quote);

        const order = await useCase.execute({ quoteId: quote.quoteId, customerId: customer.customerId });

        expect(order.customerId).toBe(customer.customerId);
        await expect(orderRepository.findById(order.orderId)).resolves.toEqual(order);
    });

    it("rejects an unknown customer identity", async () => {
        const { useCase, quoteRepository } = createUseCase();
        await quoteRepository.save(quote);

        await expect(useCase.execute({ quoteId: quote.quoteId, customerId: "missing" })).rejects.toThrow("حساب کاربری پیدا نشد");
    });

    it("creates an order as an immutable snapshot of the persisted quote", async () => {
        const { useCase, quoteRepository, orderRepository } = createUseCase();
        await quoteRepository.save(quote);

        const order = await useCase.execute({ quoteId: quote.quoteId });

        expect(order.orderId).toBeTypeOf("string");
        expect(order.quoteId).toBe(quote.quoteId);
        expect(order.status).toBe("pending_confirmation");
        expect(order.market).toEqual(quote.market);
        expect(order.items).toEqual(quote.items);
        expect(order.total).toBe(quote.total);
        await expect(orderRepository.findById(order.orderId)).resolves.toEqual(order);
    });

    it("snapshots the authenticated customer's selected address into the order", async () => {
        const { useCase, quoteRepository, orderRepository } = createUseCase([customerAddress]);
        await quoteRepository.save(quote);

        const order = await useCase.execute({
            quoteId: quote.quoteId,
            customerId: customer.customerId,
            addressId: customerAddress.id,
        });

        expect(order.address).toEqual({
            addressId: customerAddress.id,
            title: customerAddress.title,
            recipientName: customerAddress.recipientName,
            phone: customerAddress.phone,
            province: customerAddress.province,
            city: customerAddress.city,
            address: customerAddress.address,
            postalCode: customerAddress.postalCode,
        });
        await expect(orderRepository.findById(order.orderId)).resolves.toEqual(order);
    });

    it("rejects an address that is not owned by the authenticated customer", async () => {
        const { useCase, quoteRepository } = createUseCase([customerAddress]);
        await quoteRepository.save(quote);

        await expect(useCase.execute({
            quoteId: quote.quoteId,
            customerId: customer.customerId,
            addressId: foreignAddress.id,
        })).rejects.toThrow("آدرس انتخاب‌شده پیدا نشد");
    });

    it("is idempotent for the same quote", async () => {
        const { useCase, quoteRepository, orderRepository } = createUseCase();
        await quoteRepository.save(quote);

        const first = await useCase.execute({ quoteId: quote.quoteId, customerId: customer.customerId });
        const second = await useCase.execute({ quoteId: quote.quoteId, customerId: customer.customerId });

        expect(second).toEqual(first);
        expect(await orderRepository.findByQuoteId(quote.quoteId)).toEqual(first);
    });
});
