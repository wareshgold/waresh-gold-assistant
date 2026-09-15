import type { PaymentSettlementRepository } from "../../application/payment/PaymentSettlementRepository";

export class D1PaymentSettlementRepository implements PaymentSettlementRepository {
    constructor(private readonly db: D1Database) {}

    async settle(input: {
        paymentId: string;
        orderId: string;
        referenceId: string;
        updatedAt: string;
    }): Promise<void> {
        const results = await this.db.batch([
            this.db.prepare(
                `UPDATE payments
                 SET status = 'paid', updated_at = ?1, reference_id = ?2
                 WHERE payment_id = ?3
                   AND order_id = ?4
                   AND status = 'verifying'
                   AND EXISTS (
                       SELECT 1 FROM orders
                       WHERE order_id = ?4 AND status = 'confirmed'
                   )`
            ).bind(input.updatedAt, input.referenceId, input.paymentId, input.orderId),
            this.db.prepare(
                `UPDATE orders
                 SET status = 'paid', updated_at = ?1
                 WHERE order_id = ?2
                   AND status = 'confirmed'
                   AND EXISTS (
                       SELECT 1 FROM payments
                       WHERE payment_id = ?3
                         AND order_id = ?2
                         AND status = 'paid'
                   )`
            ).bind(input.updatedAt, input.orderId, input.paymentId),
        ]);

        if (results.length !== 2 || !results[0].meta.changes || !results[1].meta.changes) {
            throw new Error("تسویه پرداخت انجام نشد.");
        }
    }
}
