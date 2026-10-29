import { describe, expect, it } from "vitest";
import { canTransitionPaymentStatus, transitionPaymentStatus } from "./PaymentStatusTransition";

describe("PaymentStatusTransition", () => {
    it("allows the lifecycle transitions used by checkout", () => {
        expect(canTransitionPaymentStatus("pending", "initiated")).toBe(true);
        expect(canTransitionPaymentStatus("pending", "failed")).toBe(true);
        expect(canTransitionPaymentStatus("failed", "pending")).toBe(true);
        expect(canTransitionPaymentStatus("initiated", "verifying")).toBe(true);
        expect(canTransitionPaymentStatus("verifying", "paid")).toBe(true);
        expect(canTransitionPaymentStatus("paid", "refunded")).toBe(true);
    });

    it("rejects terminal-state regressions", () => {
        expect(canTransitionPaymentStatus("paid", "pending")).toBe(false);
        expect(canTransitionPaymentStatus("paid", "initiated")).toBe(false);
        expect(canTransitionPaymentStatus("cancelled", "pending")).toBe(false);
        expect(canTransitionPaymentStatus("expired", "initiated")).toBe(false);
        expect(canTransitionPaymentStatus("refunded", "paid")).toBe(false);
    });

    it("throws when an invalid transition is requested", () => {
        expect(() => transitionPaymentStatus("paid", "failed")).toThrow("انتقال وضعیت پرداخت");
    });

    it("treats a same-status transition as idempotent", () => {
        expect(transitionPaymentStatus("paid", "paid")).toBe("paid");
    });
});
