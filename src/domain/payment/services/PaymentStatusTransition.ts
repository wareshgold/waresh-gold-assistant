import type { PaymentStatus } from "../entities/Payment";

const transitions: Record<PaymentStatus, readonly PaymentStatus[]> = {
    pending: ["initiated", "failed", "cancelled", "expired"],
    initiated: ["verifying", "failed", "cancelled", "expired"],
    verifying: ["initiated", "paid", "failed", "cancelled", "expired"],
    paid: ["refunded"],
    failed: ["pending", "cancelled", "expired"],
    cancelled: [],
    expired: [],
    refunded: [],
};

export function canTransitionPaymentStatus(from: PaymentStatus, to: PaymentStatus): boolean {
    return from === to || transitions[from].includes(to);
}

export function transitionPaymentStatus(from: PaymentStatus, to: PaymentStatus): PaymentStatus {
    if (!canTransitionPaymentStatus(from, to)) {
        throw new Error(`انتقال وضعیت پرداخت از ${from} به ${to} مجاز نیست.`);
    }
    return to;
}
