import { describe, expect, it, vi } from "vitest";
import { D1PaymentSettlementRepository } from "./D1PaymentSettlementRepository";

describe("D1PaymentSettlementRepository", () => {
    it("settles payment and moves the confirmed order to paid in one batch", async () => {
        const first = {
            meta: { changes: 1 },
        };
        const second = {
            meta: { changes: 1 },
        };
        const prepare = vi.fn()
            .mockReturnValueOnce({ bind: vi.fn().mockReturnValue(first) })
            .mockReturnValueOnce({ bind: vi.fn().mockReturnValue(second) });
        const db = {
            prepare,
            batch: vi.fn().mockResolvedValue([first, second]),
        } as unknown as D1Database;

        const repository = new D1PaymentSettlementRepository(db);

        await expect(repository.settle({
            paymentId: "payment-1",
            orderId: "order-1",
            referenceId: "ref-1",
            updatedAt: "2026-09-16T06:00:00.000Z",
        })).resolves.toBeUndefined();

        expect(prepare).toHaveBeenCalledTimes(2);
        expect(db.batch).toHaveBeenCalledTimes(1);
        expect(db.batch).toHaveBeenCalledWith([first, second]);
    });

    it("keeps settlement guarded by the expected payment and order states", async () => {
        const first = { meta: { changes: 1 } };
        const second = { meta: { changes: 1 } };
        const paymentBind = vi.fn().mockReturnValue(first);
        const orderBind = vi.fn().mockReturnValue(second);
        const prepare = vi.fn()
            .mockReturnValueOnce({ bind: paymentBind })
            .mockReturnValueOnce({ bind: orderBind });
        const db = {
            prepare,
            batch: vi.fn().mockResolvedValue([first, second]),
        } as unknown as D1Database;

        const repository = new D1PaymentSettlementRepository(db);
        await repository.settle({
            paymentId: "payment-1",
            orderId: "order-1",
            referenceId: "ref-1",
            updatedAt: "2026-09-16T06:00:00.000Z",
        });

        const paymentSql = prepare.mock.calls[0][0] as string;
        const orderSql = prepare.mock.calls[1][0] as string;

        expect(paymentSql).toContain("status = 'verifying'");
        expect(paymentSql).toContain("status = 'confirmed'");
        expect(paymentSql).toContain("order_id = ?4");
        expect(orderSql).toContain("status = 'confirmed'");
        expect(orderSql).toContain("status = 'paid'");
        expect(orderSql).toContain("payment_id = ?3");
        expect(orderSql).toContain("status = 'paid'");

        expect(paymentBind).toHaveBeenCalledWith(
            "2026-09-16T06:00:00.000Z",
            "ref-1",
            "payment-1",
            "order-1",
        );
        expect(orderBind).toHaveBeenCalledWith(
            "2026-09-16T06:00:00.000Z",
            "order-1",
            "payment-1",
        );
    });

    it("rejects when either payment or order update is not applied", async () => {
        const paymentUpdate = { meta: { changes: 1 } };
        const orderUpdate = { meta: { changes: 0 } };
        const db = {
            prepare: vi.fn()
                .mockReturnValueOnce({ bind: vi.fn().mockReturnValue(paymentUpdate) })
                .mockReturnValueOnce({ bind: vi.fn().mockReturnValue(orderUpdate) }),
            batch: vi.fn().mockResolvedValue([paymentUpdate, orderUpdate]),
        } as unknown as D1Database;

        const repository = new D1PaymentSettlementRepository(db);

        await expect(repository.settle({
            paymentId: "payment-1",
            orderId: "order-1",
            referenceId: "ref-1",
            updatedAt: "2026-09-16T06:00:00.000Z",
        })).rejects.toThrow("تسویه پرداخت انجام نشد.");
    });
});
