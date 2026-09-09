import type { Payment, PaymentStatus } from "../../domain/payment/entities/Payment";
import type { PaymentRepository } from "../../domain/payment/repositories/PaymentRepository";

export class MemoryPaymentRepository implements PaymentRepository {
    private readonly payments = new Map<string, Payment>();

    async save(payment: Payment): Promise<void> {
        this.payments.set(payment.paymentId, { ...payment });
    }

    async findById(paymentId: string): Promise<Payment | null> {
        const payment = this.payments.get(paymentId);
        return payment ? { ...payment } : null;
    }

    async findLatestByOrderId(orderId: string): Promise<Payment | null> {
        const matches = [...this.payments.values()]
            .filter((payment) => payment.orderId === orderId)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        return matches[0] ? { ...matches[0] } : null;
    }

    async findActiveByOrderId(orderId: string): Promise<Payment | null> {
        const matches = [...this.payments.values()]
            .filter((payment) => payment.orderId === orderId && (payment.status === "pending" || payment.status === "initiated"))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        return matches[0] ? { ...matches[0] } : null;
    }

    async updateStatus(input: {
        paymentId: string;
        status: PaymentStatus;
        updatedAt: string;
        authority?: string | null;
        referenceId?: string | null;
    }): Promise<void> {
        const payment = this.payments.get(input.paymentId);
        if (!payment) throw new Error("پرداخت پیدا نشد.");
        this.payments.set(input.paymentId, {
            ...payment,
            status: input.status,
            updatedAt: input.updatedAt,
            ...(input.authority !== undefined ? { authority: input.authority } : {}),
            ...(input.referenceId !== undefined ? { referenceId: input.referenceId } : {}),
        });
    }
}
