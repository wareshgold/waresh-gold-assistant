import type { OrderStatus } from "../../domain/catalog/entities/Order";
import type { Payment } from "../../domain/payment/entities/Payment";
import type { PaymentGateway } from "../../domain/payment/gateways/PaymentGateway";
import type { PaymentRepository } from "../../domain/payment/repositories/PaymentRepository";
import type { OrderRepository } from "../../domain/catalog/repositories/OrderRepository";

export class VerifyPaymentUseCase {
    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly orderRepository: Pick<OrderRepository, "findById" | "updateStatus">,
        private readonly paymentGateway: PaymentGateway,
    ) {}

    async execute(input: { paymentId: string; authority: string }): Promise<Payment> {
        const paymentId = input?.paymentId?.trim();
        const authority = input?.authority?.trim();
        if (!paymentId) throw new Error("شناسه پرداخت الزامی است.");
        if (!authority) throw new Error("شناسه تراکنش درگاه الزامی است.");

        const payment = await this.paymentRepository.findById(paymentId);
        if (!payment) throw new Error("پرداخت پیدا نشد.");

        if (payment.status === "paid") return payment;
        if (payment.status !== "initiated") throw new Error("این پرداخت قابل تأیید نیست.");
        if (!payment.authority || payment.authority !== authority) throw new Error("شناسه پرداخت معتبر نیست.");

        const order = await this.orderRepository.findById(payment.orderId);
        if (!order) throw new Error("سفارش پرداخت پیدا نشد.");
        if (order.status !== "confirmed") throw new Error("سفارش برای تأیید پرداخت آماده نیست.");

        const verification = await this.paymentGateway.verify({
            paymentId: payment.paymentId,
            authority,
            amount: payment.amount,
        });

        const updatedAt = new Date().toISOString();
        await this.paymentRepository.updateStatus({
            paymentId: payment.paymentId,
            status: "paid",
            updatedAt,
            referenceId: verification.referenceId,
        });

        const paidStatus: OrderStatus = "paid";
        await this.orderRepository.updateStatus(payment.orderId, paidStatus, updatedAt);

        return {
            ...payment,
            status: "paid",
            referenceId: verification.referenceId,
            updatedAt,
        };
    }
}
