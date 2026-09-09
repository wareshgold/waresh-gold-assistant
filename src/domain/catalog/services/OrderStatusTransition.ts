import type { OrderStatus } from "../entities/Order";

const transitions: Record<OrderStatus, readonly OrderStatus[]> = {
    pending_confirmation: ["confirmed", "cancelled", "expired"],
    confirmed: ["paid", "cancelled", "expired"],
    paid: ["processing", "cancelled"],
    processing: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
    expired: [],
};

export function canTransitionOrderStatus(from: OrderStatus, to: OrderStatus): boolean {
    return transitions[from].includes(to);
}

export function transitionOrderStatus(from: OrderStatus, to: OrderStatus): OrderStatus {
    if (!canTransitionOrderStatus(from, to)) {
        throw new Error(`انتقال وضعیت سفارش از ${from} به ${to} مجاز نیست.`);
    }
    return to;
}
