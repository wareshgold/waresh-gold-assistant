import { describe, expect, it } from "vitest";
import type { Order } from "../../domain/catalog/entities/Order";
import type { PaymentGateway } from "../../domain/payment/gateways/PaymentGateway";
import { MemoryPaymentRepository } from "../../infrastructure/payment/MemoryPaymentRepository";
import { CreatePaymentUseCase } from "./CreatePaymentUseCase";

const order: Order = {
    orderId: "order-1",
    quoteId: "quote-1",
    customerId: "customer-1",
    address: null,
    status: "confirmed",
    createdAt: "2026-09-09T10:00:00.000Z",
    updatedAt: "2026-09-09T10:00:00.000Z",
    market: { gold18Price: 100, currencyPrice: 100, ouncePrice: null, updatedAt: "2026-09-09T10:00:00.000Z" },
    items: [],
    total: 5000000,
};

const gateway: PaymentGateway = {
    name: "test",
    async initiate() { return { authority: "AUTH-1", paymentUrl: "https://pay.test/AUTH-1" }; },
    async verify() { return { referenceId: "REF-1" }; },
};

describe("CreatePaymentUseCase", () => {
    it("creates an initiated payment for a confirmed order", async () => {
        const repository = new MemoryPaymentRepository();
        const useCase = new CreatePaymentUseCase(
            { findById: async () => order },
            repository,
            gateway,
            () => "payment-1",
        );

        const result = await useCase.execute({ orderId: "order-1" });

        expect(result.payment.paymentId).toBe("payment-1");
        expect(result.payment.status).toBe("initiated");
        expect(result.payment.amount).toBe(5000000);
        expect(result.payment.authority).toBe("AUTH-1");
        expect(result.paymentUrl).toBe("https://pay.test/AUTH-1");
    });

    it("rejects orders that are not confirmed", async () => {
        const repository = new MemoryPaymentRepository();
        const useCase = new CreatePaymentUseCase(
            { findById: async () => ({ ...order, status: "pending_confirmation" }) },
            repository,
            gateway,
            () => "payment-1",
        );

        await expect(useCase.execute({ orderId: "order-1" })).rejects.toThrow("سفارش برای پرداخت آماده نیست.");
    });

    it("prevents a second active payment for the same order", async () => {
        const repository = new MemoryPaymentRepository();
        const useCase = new CreatePaymentUseCase(
            { findById: async () => order },
            repository,
            gateway,
            () => "payment-1",
        );

        await useCase.execute({ orderId: "order-1" });
        await expect(useCase.execute({ orderId: "order-1" })).rejects.toThrow("برای این سفارش یک پرداخت فعال وجود دارد.");
    });

    it("allows a new payment after a previous payment has failed", async () => {
        const repository = new MemoryPaymentRepository();
        let call = 0;
        const retryGateway: PaymentGateway = {
            name: "test",
            async initiate(input) {
                call += 1;
                if (call === 1) throw new Error("gateway unavailable");
                return { authority: `AUTH-${input.paymentId}`, paymentUrl: "https://pay.test/retry" };
            },
            async verify() { return { referenceId: "REF-1" }; },
        };
        let id = 0;
        const useCase = new CreatePaymentUseCase(
            { findById: async () => order },
            repository,
            retryGateway,
            () => `payment-${++id}`,
        );

        await expect(useCase.execute({ orderId: "order-1" })).rejects.toThrow("gateway unavailable");
        const retry = await useCase.execute({ orderId: "order-1" });

        expect(retry.payment.paymentId).toBe("payment-2");
        expect(retry.payment.status).toBe("initiated");
        expect((await repository.findById("payment-1"))?.status).toBe("failed");
    });
});
