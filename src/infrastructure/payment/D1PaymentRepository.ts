import type { Payment, PaymentStatus } from "../../domain/payment/entities/Payment";
import type { PaymentRepository } from "../../domain/payment/repositories/PaymentRepository";

export class D1PaymentRepository implements PaymentRepository {
    constructor(private readonly db: D1Database) {}

    async save(payment: Payment): Promise<void> {
        await this.db.prepare(
            `INSERT INTO payments
                (payment_id, order_id, amount, status, gateway, authority, reference_id, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`
        ).bind(
            payment.paymentId,
            payment.orderId,
            payment.amount,
            payment.status,
            payment.gateway,
            payment.authority,
            payment.referenceId,
            payment.createdAt,
            payment.updatedAt,
        ).run();
    }

    async findById(paymentId: string): Promise<Payment | null> {
        return this.findOne(
            `WHERE payment_id = ?1`,
            paymentId,
        );
    }

    async findLatestByOrderId(orderId: string): Promise<Payment | null> {
        return this.findOne(
            `WHERE order_id = ?1 ORDER BY created_at DESC LIMIT 1`,
            orderId,
        );
    }

    async findActiveByOrderId(orderId: string): Promise<Payment | null> {
        return this.findOne(
            `WHERE order_id = ?1 AND status IN ('pending', 'initiated') ORDER BY created_at DESC LIMIT 1`,
            orderId,
        );
    }

    async updateStatus(input: {
        paymentId: string;
        status: PaymentStatus;
        updatedAt: string;
        authority?: string | null;
        referenceId?: string | null;
    }): Promise<void> {
        const result = await this.db.prepare(
            `UPDATE payments
             SET status = ?1, updated_at = ?2,
                 authority = CASE WHEN ?3 IS NULL THEN authority ELSE ?3 END,
                 reference_id = CASE WHEN ?4 IS NULL THEN reference_id ELSE ?4 END
             WHERE payment_id = ?5`
        ).bind(
            input.status,
            input.updatedAt,
            input.authority ?? null,
            input.referenceId ?? null,
            input.paymentId,
        ).run();
        if (!result.meta.changes) throw new Error("پرداخت پیدا نشد.");
    }

    private async findOne(whereClause: string, value: string): Promise<Payment | null> {
        const row = await this.db.prepare(
            `SELECT payment_id, order_id, amount, status, gateway, authority, reference_id, created_at, updated_at
             FROM payments ${whereClause}`
        ).bind(value).first<PaymentRow>();
        if (!row) return null;
        return {
            paymentId: row.payment_id,
            orderId: row.order_id,
            amount: Number(row.amount),
            status: row.status as PaymentStatus,
            gateway: row.gateway,
            authority: row.authority,
            referenceId: row.reference_id,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
}

type PaymentRow = {
    payment_id: string;
    order_id: string;
    amount: number;
    status: string;
    gateway: string;
    authority: string | null;
    reference_id: string | null;
    created_at: string;
    updated_at: string;
};
