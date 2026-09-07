import type { Order } from "../../domain/catalog/entities/Order";
import type { OrderRepository } from "../../domain/catalog/repositories/OrderRepository";

export class ListCustomerOrdersUseCase {
    constructor(private readonly orderRepository: OrderRepository) {}

    async execute(input: { customerId: string }): Promise<Order[]> {
        const customerId = input?.customerId?.trim();
        if (!customerId) throw new Error("Customer ID is required");
        return this.orderRepository.findByCustomerId(customerId);
    }
}
