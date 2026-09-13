import type { Order } from "../../domain/catalog/entities/Order";
import type { OrderRepository } from "../../domain/catalog/repositories/OrderRepository";
import { transitionOrderStatus } from "../../domain/catalog/services/OrderStatusTransition";

const CANCELLABLE_STATUSES = ["pending_confirmation", "confirmed"] as const;

export class CancelCustomerOrderUseCase {
    constructor(private readonly orderRepository: OrderRepository) {}

    async execute(input: { orderId: string; customerId: string }): Promise<Order> {
        const orderId = input?.orderId?.trim();
        const customerId = input?.customerId?.trim();
        if (!orderId) throw new Error("شناسه سفارش الزامی است.");
        if (!customerId) throw new Error("شناسه مشتری الزامی است.");

        const order = await this.orderRepository.findById(orderId);
        if (!order) throw new Error("سفارش پیدا نشد.");
        if (order.customerId !== customerId) throw new Error("دسترسی به این سفارش مجاز نیست.");

        transitionOrderStatus(order.status, "cancelled");
        const updatedAt = new Date().toISOString();
        const cancelled = await this.orderRepository.cancelForCustomer(orderId, customerId, CANCELLABLE_STATUSES, updatedAt);
        if (!cancelled) {
            const current = await this.orderRepository.findById(orderId);
            if (!current) throw new Error("سفارش پیدا نشد.");
            transitionOrderStatus(current.status, "cancelled");
            throw new Error("وضعیت سفارش در حین لغو تغییر کرده است. دوباره تلاش کنید.");
        }

        return { ...order, status: "cancelled", updatedAt };
    }
}
