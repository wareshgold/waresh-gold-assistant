import { describe, expect, it } from "vitest";
import type { OrderStatus } from "../entities/Order";
import { canTransitionOrderStatus, transitionOrderStatus } from "./OrderStatusTransition";

describe("OrderStatusTransition", () => {
    const allowed: Array<[OrderStatus, OrderStatus]> = [
        ["pending_confirmation", "confirmed"],
        ["pending_confirmation", "cancelled"],
        ["pending_confirmation", "expired"],
        ["confirmed", "paid"],
        ["confirmed", "cancelled"],
        ["confirmed", "expired"],
        ["paid", "processing"],
        ["processing", "completed"],
    ];

    it.each(allowed)("allows %s -> %s", (from, to) => {
        expect(canTransitionOrderStatus(from, to)).toBe(true);
        expect(transitionOrderStatus(from, to)).toBe(to);
    });

    it.each([
        ["pending_confirmation", "paid"],
        ["confirmed", "processing"],
        ["paid", "cancelled"],
        ["paid", "completed"],
        ["processing", "cancelled"],
        ["processing", "paid"],
        ["completed", "cancelled"],
        ["cancelled", "confirmed"],
        ["expired", "confirmed"],
    ] as Array<[OrderStatus, OrderStatus]>)
    ("rejects %s -> %s", (from, to) => {
        expect(canTransitionOrderStatus(from, to)).toBe(false);
        expect(() => transitionOrderStatus(from, to)).toThrow();
    });
});
