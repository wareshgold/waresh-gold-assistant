import type { Order } from "../../domain/catalog/entities/Order";
import type { OrderRepository } from "../../domain/catalog/repositories/OrderRepository";

export class ListAdminOrdersUseCase {
    constructor(private readonly orderRepository: OrderRepository) {}

    async execute(): Promise<Order[]> {
        return this.orderRepository.findAll();
    }
}
