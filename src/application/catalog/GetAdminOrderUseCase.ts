import type { Order } from "../../domain/catalog/entities/Order";
import type { OrderRepository } from "../../domain/catalog/repositories/OrderRepository";

export class GetAdminOrderUseCase {
    constructor(private readonly orderRepository: OrderRepository) {}

    async execute(input: { orderId: string }): Promise<Order | null> {
        const orderId = input?.orderId?.trim();
        if (!orderId) throw new Error("شناسه سفارش الزامی است.");
        return this.orderRepository.findById(orderId);
    }
}
