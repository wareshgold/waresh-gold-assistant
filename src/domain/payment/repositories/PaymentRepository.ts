import type { Payment, PaymentStatus } from "../entities/Payment";

export interface PaymentRepository {
    save(payment: Payment): Promise<void>;
    createPendingIfNoActive(payment: Payment): Promise<boolean>;
    findById(paymentId: string): Promise<Payment | null>;
    findLatestByOrderId(orderId: string): Promise<Payment | null>;
    findActiveByOrderId(orderId: string): Promise<Payment | null>;
    claimFailedForRetry(input: { paymentId: string; updatedAt: string }): Promise<boolean>;
    claimForVerification(input: { paymentId: string; updatedAt: string }): Promise<boolean>;
    releaseVerification(input: { paymentId: string; updatedAt: string }): Promise<boolean>;
    updateStatus(input: {
        paymentId: string;
        expectedStatus?: PaymentStatus;
        status: PaymentStatus;
        updatedAt: string;
        authority?: string | null;
        referenceId?: string | null;
    }): Promise<void>;
}
