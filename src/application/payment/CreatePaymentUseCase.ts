import type { Order } from "../../domain/catalog/entities/Order";
import type { Payment } from "../../domain/payment/entities/Payment";
import type { PaymentGateway } from "../../domain/payment/gateways/PaymentGateway";
import type { PaymentRepository } from "../../domain/payment/repositories/PaymentRepository";

export class CreatePaymentUseCase {
    constructor(
        private readonly orderReader: { findById(orderId: string): Promise<Order | null> },
        private readonly paymentRepository: PaymentRepository,
        private readonly paymentGateway: PaymentGateway,
        private readonly idGenerator: () => string = () => crypto.randomUUID(),
    ) {}

    async execute(input: { orderId: string }): Promise<{ payment: Payment; paymentUrl: string }> {
        const orderId = input?.orderId?.trim();
        if (!orderId) throw new Error("شناسه سفارش الزامی است.");

        const order = await this.orderReader.findById(orderId);
        if (!order) throw new Error("سفارش پیدا نشد.");
        if (order.status !== "confirmed") throw new Error("سفارش برای پرداخت آماده نیست.");

        const latest = await this.paymentRepository.findLatestByOrderId(orderId);
        if (latest?.status === "paid" || latest?.status === "refunded") {
            throw new Error("این سفارش قبلاً پرداخت شده است.");
        }

        const active = await this.paymentRepository.findActiveByOrderId(orderId);
        if (active) throw new Error("برای این سفارش یک پرداخت فعال وجود دارد.");

        const now = new Date().toISOString();
        const payment: Payment = {
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

        await this.paymentRepository.save(payment);
        try {
            const initiation = await this.paymentGateway.initiate({
                paymentId: payment.paymentId,
                orderId,
                amount: payment.amount,
            });
            const initiated: Payment = {
                ...payment,
                status: "initiated",
                authority: initiation.authority,
                updatedAt: new Date().toISOString(),
            };
            await this.paymentRepository.updateStatus({
                paymentId: initiated.paymentId,
                status: initiated.status,
                updatedAt: initiated.updatedAt,
                authority: initiated.authority,
            });
            return { payment: initiated, paymentUrl: initiation.paymentUrl };
        } catch (error) {
            const failedAt = new Date().toISOString();
            await this.paymentRepository.updateStatus({
                paymentId: payment.paymentId,
                status: "failed",
                updatedAt: failedAt,
            });
            throw error;
        }
    }
}
