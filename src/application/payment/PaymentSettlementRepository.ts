export interface PaymentSettlementRepository {
    settle(input: {
        paymentId: string;
        orderId: string;
        referenceId: string;
        updatedAt: string;
    }): Promise<void>;
}
