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
