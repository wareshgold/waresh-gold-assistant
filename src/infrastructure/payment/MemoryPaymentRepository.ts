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

    async findByOrderId(orderId: string): Promise<Payment | null> {
        for (const payment of this.payments.values()) {
            if (payment.orderId === orderId) return { ...payment };
        }
        return null;
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
