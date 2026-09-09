import type { OrderStatus } from "../../domain/catalog/entities/Order";
import type { OrderRepository } from "../../domain/catalog/repositories/OrderRepository";
import { transitionOrderStatus } from "../../domain/catalog/services/OrderStatusTransition";

export class UpdateOrderStatusUseCase {
    constructor(private readonly orderRepository: OrderRepository) {}

    async execute(input: { orderId: string; status: OrderStatus }): Promise<NonNullable<Awaited<ReturnType<OrderRepository["findById"]>>>> {
        const orderId = input?.orderId?.trim();
        if (!orderId) throw new Error("شناسه سفارش الزامی است.");

        const order = await this.orderRepository.findById(orderId);
        if (!order) throw new Error("سفارش پیدا نشد.");

        const status = transitionOrderStatus(order.status, input.status);
        const updated = {
            ...order,
            status,
            updatedAt: new Date().toISOString(),
        };

        await this.orderRepository.save(updated);
        return updated;
    }
}
