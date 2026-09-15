import type { Payment } from "../../domain/payment/entities/Payment";
import type { PaymentGateway } from "../../domain/payment/gateways/PaymentGateway";
import type { PaymentRepository } from "../../domain/payment/repositories/PaymentRepository";
import type { OrderRepository } from "../../domain/catalog/repositories/OrderRepository";
import type { PaymentSettlementRepository } from "./PaymentSettlementRepository";

export class VerifyPaymentUseCase {
    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly orderRepository: Pick<OrderRepository, "findById">,
        private readonly paymentGateway: PaymentGateway,
        private readonly settlementRepository: PaymentSettlementRepository,
    ) {}

    async execute(input: { paymentId: string; authority: string; customerId: string }): Promise<Payment> {
        const paymentId = input?.paymentId?.trim();
        const authority = input?.authority?.trim();
        const customerId = input?.customerId?.trim();
        if (!paymentId) throw new Error("شناسه پرداخت الزامی است.");
        if (!authority) throw new Error("شناسه تراکنش درگاه الزامی است.");
        if (!customerId) throw new Error("شناسه مشتری الزامی است.");

        const payment = await this.paymentRepository.findById(paymentId);
        if (!payment) throw new Error("پرداخت پیدا نشد.");

        const order = await this.orderRepository.findById(payment.orderId);
        if (!order) throw new Error("سفارش پرداخت پیدا نشد.");
        if (order.customerId !== customerId) throw new Error("دسترسی به این پرداخت مجاز نیست.");

        if (payment.status === "paid") return payment;
        if (payment.status !== "initiated") throw new Error("این پرداخت قابل تأیید نیست.");
        if (!payment.authority || payment.authority !== authority) throw new Error("شناسه پرداخت معتبر نیست.");
        if (order.status !== "confirmed") throw new Error("سفارش برای تأیید پرداخت آماده نیست.");

        const verifyingAt = new Date().toISOString();
        const claimed = await this.paymentRepository.claimForVerification({
            paymentId: payment.paymentId,
            updatedAt: verifyingAt,
        });

        if (!claimed) {
            const current = await this.paymentRepository.findById(payment.paymentId);
            if (current?.status === "paid") return current;
            throw new Error("این پرداخت در حال تأیید است.");
        }

        try {
            const verification = await this.paymentGateway.verify({
                paymentId: payment.paymentId,
                authority,
                amount: payment.amount,
            });

            const updatedAt = new Date().toISOString();
            await this.settlementRepository.settle({
                paymentId: payment.paymentId,
                orderId: payment.orderId,
                referenceId: verification.referenceId,
                updatedAt,
            });

            return {
                ...payment,
                status: "paid",
                referenceId: verification.referenceId,
                updatedAt,
            };
        } catch (error) {
            await this.paymentRepository.releaseVerification({
                paymentId: payment.paymentId,
                updatedAt: new Date().toISOString(),
            });
            throw error;
        }
    }
}
