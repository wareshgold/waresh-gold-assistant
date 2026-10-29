import type { Order } from "../../domain/catalog/entities/Order";
import type { Payment } from "../../domain/payment/entities/Payment";
import type { PaymentGateway } from "../../domain/payment/gateways/PaymentGateway";
import { transitionPaymentStatus } from "../../domain/payment/services/PaymentStatusTransition";
import type { PaymentRepository } from "../../domain/payment/repositories/PaymentRepository";

export class CreatePaymentUseCase {
    constructor(
        private readonly orderReader: { findById(orderId: string): Promise<Order | null> },
        private readonly paymentRepository: PaymentRepository,
        private readonly paymentGateway: PaymentGateway,
        private readonly idGenerator: () => string = () => crypto.randomUUID(),
    ) {}

    async execute(input: { orderId: string; customerId: string }): Promise<{ payment: Payment; paymentUrl: string }> {
        const orderId = input?.orderId?.trim();
        const customerId = input?.customerId?.trim();
        if (!orderId) throw new Error("شناسه سفارش الزامی است.");
        if (!customerId) throw new Error("احراز هویت لازم است.");

        const order = await this.orderReader.findById(orderId);
        if (!order) throw new Error("سفارش پیدا نشد.");
        if (order.customerId !== customerId) throw new Error("این سفارش متعلق به حساب کاربری شما نیست.");
        if (order.status !== "confirmed") throw new Error("سفارش برای پرداخت آماده نیست.");

        const latest = await this.paymentRepository.findLatestByOrderId(orderId);
        if (latest?.status === "paid" || latest?.status === "refunded") {
            throw new Error("این سفارش قبلاً پرداخت شده است.");
        }

        const active = await this.paymentRepository.findActiveByOrderId(orderId);
        if (active) throw new Error("برای این سفارش یک پرداخت فعال وجود دارد.");

        const now = new Date().toISOString();
        let payment: Payment;

        if (latest?.status === "failed") {
            const claimed = await this.paymentRepository.claimFailedForRetry({
                paymentId: latest.paymentId,
                updatedAt: now,
            });
            if (!claimed) throw new Error("برای این سفارش یک پرداخت فعال وجود دارد.");
            payment = {
                ...latest,
                status: transitionPaymentStatus("failed", "pending"),
                authority: null,
                referenceId: null,
                updatedAt: now,
            };
        } else {
            payment = {
                paymentId: this.idGenerator(),
                orderId,
                amount: order.total,
                status: "pending",
                gateway: this.paymentGateway.name,
                authority: null,
                referenceId: null,
                createdAt: now,
                updatedAt: now,
            };
            const created = await this.paymentRepository.createPendingIfNoActive(payment);
            if (!created) throw new Error("برای این سفارش یک پرداخت فعال وجود دارد.");
        }

        try {
            const initiation = await this.paymentGateway.initiate({
                paymentId: payment.paymentId,
                orderId,
                amount: payment.amount,
            });
            const initiated: Payment = {
                ...payment,
                status: transitionPaymentStatus(payment.status, "initiated"),
                authority: initiation.authority,
                updatedAt: new Date().toISOString(),
            };
            await this.paymentRepository.updateStatus({
                paymentId: initiated.paymentId,
                expectedStatus: payment.status,
                status: initiated.status,
                updatedAt: initiated.updatedAt,
                authority: initiated.authority,
            });
            return { payment: initiated, paymentUrl: initiation.paymentUrl };
        } catch (error) {
            const failedAt = new Date().toISOString();
            await this.paymentRepository.updateStatus({
                paymentId: payment.paymentId,
                expectedStatus: payment.status,
                status: transitionPaymentStatus(payment.status, "failed"),
                updatedAt: failedAt,
            });
            throw error;
        }
    }
}
