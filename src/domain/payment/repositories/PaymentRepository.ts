import type { Payment, PaymentStatus } from "../entities/Payment";

export interface PaymentRepository {
    save(payment: Payment): Promise<void>;
    findById(paymentId: string): Promise<Payment | null>;
    findLatestByOrderId(orderId: string): Promise<Payment | null>;
    findActiveByOrderId(orderId: string): Promise<Payment | null>;
    updateStatus(input: {
        paymentId: string;
        status: PaymentStatus;
        updatedAt: string;
        authority?: string | null;
        referenceId?: string | null;
    }): Promise<void>;
}
