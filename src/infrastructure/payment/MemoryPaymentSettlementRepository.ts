import type { OrderRepository } from "../../domain/catalog/repositories/OrderRepository";
import type { PaymentRepository } from "../../domain/payment/repositories/PaymentRepository";
import type { PaymentSettlementRepository } from "../../application/payment/PaymentSettlementRepository";

export class MemoryPaymentSettlementRepository implements PaymentSettlementRepository {
    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly orderRepository: OrderRepository,
    ) {}

    async settle(input: {
        paymentId: string;
        orderId: string;
        referenceId: string;
        updatedAt: string;
    }): Promise<void> {
        const payment = await this.paymentRepository.findById(input.paymentId);
        const order = await this.orderRepository.findById(input.orderId);
        if (!payment || payment.orderId !== input.orderId) throw new Error("پرداخت پیدا نشد.");
        if (!order) throw new Error("سفارش پرداخت پیدا نشد.");
        if (payment.status !== "verifying" || order.status !== "confirmed") {
            throw new Error("تسویه پرداخت انجام نشد.");
        }

        await this.paymentRepository.updateStatus({
            paymentId: payment.paymentId,
            status: "paid",
            updatedAt: input.updatedAt,
            referenceId: input.referenceId,
        });

        try {
            await this.orderRepository.updateStatus(input.orderId, "paid", input.updatedAt);
        } catch (error) {
            await this.paymentRepository.updateStatus({
                paymentId: payment.paymentId,
                status: payment.status,
                updatedAt: payment.updatedAt,
                authority: payment.authority,
                referenceId: payment.referenceId,
            });
            throw error;
        }
    }
}
