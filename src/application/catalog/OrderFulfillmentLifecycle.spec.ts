import { describe, expect, it } from "vitest";
import type { Order } from "../../domain/catalog/entities/Order";
import type { Payment } from "../../domain/payment/entities/Payment";
import { MemoryOrderRepository } from "../../infrastructure/catalog/MemoryOrderRepository";
import { MemoryPaymentRepository } from "../../infrastructure/payment/MemoryPaymentRepository";
import { MemoryPaymentSettlementRepository } from "../../infrastructure/payment/MemoryPaymentSettlementRepository";
import { UpdateOrderStatusUseCase } from "./UpdateOrderStatusUseCase";
import { VerifyPaymentUseCase } from "../payment/VerifyPaymentUseCase";

describe("Order fulfillment lifecycle", () => {
    it("moves confirmed order through paid, processing and completed with one server-backed history", async () => {
        const orderRepository = new MemoryOrderRepository();
        const paymentRepository = new MemoryPaymentRepository();
        const settlementRepository = new MemoryPaymentSettlementRepository(paymentRepository, orderRepository);
        const order: Order = {
            orderId: "order-lifecycle-1",
            quoteId: "quote-lifecycle-1",
            customerId: "customer-1",
            address: null,
            status: "confirmed",
            createdAt: "2026-09-16T09:00:00.000Z",
            updatedAt: "2026-09-16T09:00:00.000Z",
            market: {
                gold18Price: 23_549_000,
                currencyPrice: 1_000_000,
                ouncePrice: 4_000,
                updatedAt: "2026-09-16T09:00:00.000Z",
            },
            items: [],
            total: 5_000_000,
        };
        const payment: Payment = {
            paymentId: "payment-lifecycle-1",
            orderId: order.orderId,
            amount: order.total,
            status: "initiated",
            gateway: "test",
            authority: "AUTH-LIFECYCLE",
            referenceId: null,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };

        await orderRepository.save(order);
        await paymentRepository.save(payment);

        const verifyPayment = new VerifyPaymentUseCase(
            paymentRepository,
            orderRepository,
            {
                name: "test",
                initiate: async () => ({ authority: "AUTH-LIFECYCLE", paymentUrl: "https://example.test/pay" }),
                verify: async () => ({ referenceId: "REF-LIFECYCLE" }),
            },
            settlementRepository,
        );
        const updateStatus = new UpdateOrderStatusUseCase(orderRepository);

        await verifyPayment.execute({
            paymentId: payment.paymentId,
            authority: payment.authority!,
            customerId: order.customerId!,
        });
        await updateStatus.execute({ orderId: order.orderId, status: "processing" });
        await updateStatus.execute({ orderId: order.orderId, status: "completed" });

        await expect(orderRepository.findById(order.orderId)).resolves.toMatchObject({ status: "completed" });
        await expect(paymentRepository.findById(payment.paymentId)).resolves.toMatchObject({
            status: "paid",
            referenceId: "REF-LIFECYCLE",
        });
        await expect(orderRepository.getStatusHistory(order.orderId)).resolves.toEqual([
            expect.objectContaining({ fromStatus: null, toStatus: "confirmed" }),
            expect.objectContaining({ fromStatus: "confirmed", toStatus: "paid" }),
            expect.objectContaining({ fromStatus: "paid", toStatus: "processing" }),
            expect.objectContaining({ fromStatus: "processing", toStatus: "completed" }),
        ]);
    });
});
