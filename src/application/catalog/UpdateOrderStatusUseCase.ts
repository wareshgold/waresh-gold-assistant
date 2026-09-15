import type { Order, OrderStatus } from "../../domain/catalog/entities/Order";
import type { OrderRepository } from "../../domain/catalog/repositories/OrderRepository";
import { transitionOrderStatus } from "../../domain/catalog/services/OrderStatusTransition";

export class UpdateOrderStatusUseCase {
    constructor(private readonly orderRepository: OrderRepository) {}

    async execute(input: { orderId: string; status: OrderStatus }): Promise<Order> {
        const orderId = input?.orderId?.trim();
        if (!orderId) throw new Error("شناسه سفارش الزامی است.");

        const order = await this.orderRepository.findById(orderId);
        if (!order) throw new Error("سفارش پیدا نشد.");

        const status = transitionOrderStatus(order.status, input.status);
        const updatedAt = new Date().toISOString();
        const updated = await this.orderRepository.updateStatus(orderId, order.status, status, updatedAt);
        if (!updated) {
            throw new Error("وضعیت سفارش دیگر مجاز نیست؛ سفارش توسط درخواست دیگری تغییر کرده است.");
        }

        return { ...order, status, updatedAt };
    }
}
