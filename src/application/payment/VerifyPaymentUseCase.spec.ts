import { describe, expect, it } from "vitest";
import type { Order } from "../../domain/catalog/entities/Order";
import type { PaymentGateway } from "../../domain/payment/gateways/PaymentGateway";
import { MemoryOrderRepository } from "../../infrastructure/catalog/MemoryOrderRepository";
import { MemoryPaymentRepository } from "../../infrastructure/payment/MemoryPaymentRepository";
import { MemoryPaymentSettlementRepository } from "../../infrastructure/payment/MemoryPaymentSettlementRepository";
import { VerifyPaymentUseCase } from "./VerifyPaymentUseCase";

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
    async verify(input) {
        expect(input.authority).toBe("AUTH-1");
        expect(input.amount).toBe(5000000);
        return { referenceId: "REF-1" };
    },
};

async function saveInitiatedPayment(repository: MemoryPaymentRepository): Promise<void> {
    await repository.save({
        paymentId: "payment-1",
        orderId: "order-1",
        amount: 5000000,
        status: "initiated",
        gateway: "test",
        authority: "AUTH-1",
        referenceId: null,
        createdAt: "2026-09-09T10:01:00.000Z",
        updatedAt: "2026-09-09T10:01:00.000Z",
    });
}

describe("VerifyPaymentUseCase", () => {
    it("verifies the gateway result and moves the order to paid", async () => {
        const paymentRepository = new MemoryPaymentRepository();
        const orderRepository = new MemoryOrderRepository();
        await orderRepository.save(order);
        await saveInitiatedPayment(paymentRepository);

        const settlementRepository = new MemoryPaymentSettlementRepository(paymentRepository, orderRepository);
        const useCase = new VerifyPaymentUseCase(paymentRepository, orderRepository, gateway, settlementRepository);
        const result = await useCase.execute({ paymentId: "payment-1", authority: "AUTH-1", customerId: "customer-1" });

        expect(result.status).toBe("paid");
        expect(result.referenceId).toBe("REF-1");
        expect((await paymentRepository.findById("payment-1"))?.status).toBe("paid");
        expect((await orderRepository.findById("order-1"))?.status).toBe("paid");
    });

    it("rejects an authority mismatch before calling the gateway", async () => {
        const paymentRepository = new MemoryPaymentRepository();
        const orderRepository = new MemoryOrderRepository();
        await orderRepository.save(order);
        await saveInitiatedPayment(paymentRepository);

        const settlementRepository = new MemoryPaymentSettlementRepository(paymentRepository, orderRepository);
        const useCase = new VerifyPaymentUseCase(paymentRepository, orderRepository, gateway, settlementRepository);
        await expect(useCase.execute({ paymentId: "payment-1", authority: "WRONG", customerId: "customer-1" })).rejects.toThrow("شناسه پرداخت معتبر نیست.");
        expect((await paymentRepository.findById("payment-1"))?.status).toBe("initiated");
    });

    it("is idempotent when the payment is already paid", async () => {
        const paymentRepository = new MemoryPaymentRepository();
        const orderRepository = new MemoryOrderRepository();
        await orderRepository.save({ ...order, status: "paid" });
        await paymentRepository.save({
            paymentId: "payment-1",
            orderId: "order-1",
            amount: 5000000,
            status: "paid",
            gateway: "test",
            authority: "AUTH-1",
            referenceId: "REF-1",
            createdAt: "2026-09-09T10:01:00.000Z",
            updatedAt: "2026-09-09T10:02:00.000Z",
        });

        const settlementRepository = new MemoryPaymentSettlementRepository(paymentRepository, orderRepository);
        const useCase = new VerifyPaymentUseCase(paymentRepository, orderRepository, gateway, settlementRepository);
        const result = await useCase.execute({ paymentId: "payment-1", authority: "AUTH-1", customerId: "customer-1" });

        expect(result.status).toBe("paid");
        expect(result.referenceId).toBe("REF-1");
    });

    it("rejects another customer even when the payment is already paid", async () => {
        const paymentRepository = new MemoryPaymentRepository();
        const orderRepository = new MemoryOrderRepository();
        await orderRepository.save({ ...order, status: "paid" });
        await paymentRepository.save({
            paymentId: "payment-1",
            orderId: "order-1",
            amount: 5000000,
            status: "paid",
            gateway: "test",
            authority: "AUTH-1",
            referenceId: "REF-1",
            createdAt: "2026-09-09T10:01:00.000Z",
            updatedAt: "2026-09-09T10:02:00.000Z",
        });

        const settlementRepository = new MemoryPaymentSettlementRepository(paymentRepository, orderRepository);
        const useCase = new VerifyPaymentUseCase(paymentRepository, orderRepository, gateway, settlementRepository);

        await expect(useCase.execute({ paymentId: "payment-1", authority: "AUTH-1", customerId: "customer-2" })).rejects.toThrow("دسترسی به این پرداخت مجاز نیست.");
    });

    it("restores the payment when the order transition fails", async () => {
        const paymentRepository = new MemoryPaymentRepository();
        const orderRepository = new FailingOrderRepository();
        await orderRepository.save(order);
        await saveInitiatedPayment(paymentRepository);

        const settlementRepository = new MemoryPaymentSettlementRepository(paymentRepository, orderRepository);
        const useCase = new VerifyPaymentUseCase(paymentRepository, orderRepository, gateway, settlementRepository);

        await expect(useCase.execute({ paymentId: "payment-1", authority: "AUTH-1", customerId: "customer-1" })).rejects.toThrow("order transition failed");
        expect((await paymentRepository.findById("payment-1"))?.status).toBe("initiated");
        expect((await orderRepository.findById("order-1"))?.status).toBe("confirmed");
    });
});

class FailingOrderRepository extends MemoryOrderRepository {
    async updateStatus(): Promise<void> {
        throw new Error("order transition failed");
    }
}
