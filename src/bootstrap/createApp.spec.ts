import { describe, expect, it, vi } from "vitest";
import { createApp } from "./createApp";
import { CreateOrderFromQuoteUseCase } from "../application/catalog/CreateOrderFromQuoteUseCase";
import { MemoryCustomerRepository } from "../infrastructure/customer/MemoryCustomerRepository";
import { MemoryOrderQuoteRepository } from "../infrastructure/catalog/MemoryOrderQuoteRepository";
import { MemoryOrderRepository } from "../infrastructure/catalog/MemoryOrderRepository";
import type { Customer } from "../domain/customer/entities/Customer";
import type { CustomerAddress } from "../domain/customer/entities/CustomerAddress";
import type { OrderQuote } from "../domain/catalog/entities/OrderQuote";

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

const address: CustomerAddress = {
    id: "address-1",
    customerId: customer.customerId,
    title: "خانه",
    recipientName: "Ali Test",
    phone: "09120000000",
    province: "تهران",
    city: "تهران",
    address: "خیابان نمونه، پلاک ۱",
    postalCode: "1234567890",
    createdAt: "2026-09-07T06:00:00.000Z",
    updatedAt: "2026-09-07T06:00:00.000Z",
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
        quantity: 1,
        weightGrams: 1.2,
        unitPrice: 32_051_131,
        lineTotal: 32_051_131,
    }],
    total: 32_051_131,
};

function createTestApp() {
    const customerRepository = new MemoryCustomerRepository();
    const quoteRepository = new MemoryOrderQuoteRepository();
    const orderRepository = new MemoryOrderRepository();
    const createOrderFromQuoteUseCase = new CreateOrderFromQuoteUseCase(
        quoteRepository,
        orderRepository,
        customerRepository,
    );

    const sessionService = {
        get: vi.fn(async (sessionId: string) => sessionId === "session-1" ? {
            sessionId: "session-1",
            customerId: customer.customerId,
            createdAt: "2026-09-07T06:00:00.000Z",
            expiresAt: "2026-09-08T06:00:00.000Z",
        } : null),
    };

    const container = {
        telegramWebhookController: {} as never,
        systemMetricsController: { handle: vi.fn(async () => ({})) } as never,
        monitoringService: { record: vi.fn(async () => undefined) } as never,
        healthCheckService: { execute: vi.fn(async () => ({ status: "ok" })) } as never,
        calculateGoldPriceUseCase: {} as never,
        createOrderQuoteUseCase: {} as never,
        getOrderQuoteUseCase: {} as never,
        createOrderFromQuoteUseCase,
        getOrderUseCase: {} as never,
        listCustomerOrdersUseCase: {} as never,
        marketProvider: { getCurrentPrice: vi.fn() } as never,
        snapshotService: { getHistory: vi.fn() } as never,
        getGoldBubbleDataUseCase: {} as never,
        registerCustomerUseCase: {} as never,
        loginCustomerUseCase: {} as never,
        addCustomerAddressUseCase: {} as never,
        removeCustomerAddressUseCase: {} as never,
        customerRepository,
        sessionService,
        getProductsUseCase: { execute: vi.fn() } as never,
        getProductUseCase: { execute: vi.fn() } as never,
    };

    return { app: createApp(container), customerRepository, quoteRepository, orderRepository, sessionService };
}

describe("createApp checkout order route", () => {
    it("forwards the authenticated session identity and address into order creation", async () => {
        const { app, customerRepository, quoteRepository, orderRepository, sessionService } = createTestApp();
        await customerRepository.save(customer);
        await customerRepository.saveAddress(address);
        await quoteRepository.save(quote);

        const response = await app.request("http://localhost/api/v1/orders/from-quote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Customer-Session": "session-1",
            },
            body: JSON.stringify({
                quoteId: quote.quoteId,
                customerId: "attacker-supplied-id",
                addressId: address.id,
            }),
        });

        expect(response.status).toBe(200);
        const payload = await response.json() as { order: { customerId: string; address: { addressId: string } } };
        expect(payload.order.customerId).toBe(customer.customerId);
        expect(payload.order.address.addressId).toBe(address.id);
        expect(await orderRepository.findByQuoteId(quote.quoteId)).toEqual(payload.order);
        expect(sessionService.get).toHaveBeenCalledWith("session-1");
    });

    it("rejects an invalid customer session before creating an order", async () => {
        const { app, quoteRepository, orderRepository, sessionService } = createTestApp();
        await quoteRepository.save(quote);

        const response = await app.request("http://localhost/api/v1/orders/from-quote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Customer-Session": "missing-session",
            },
            body: JSON.stringify({ quoteId: quote.quoteId, addressId: address.id }),
        });

        expect(response.status).toBe(401);
        await expect(orderRepository.findByQuoteId(quote.quoteId)).resolves.toBeNull();
        expect(sessionService.get).toHaveBeenCalledWith("missing-session");
    });
});
