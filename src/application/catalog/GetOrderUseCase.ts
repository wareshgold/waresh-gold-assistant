import type { Order } from "../../domain/catalog/entities/Order";
import type { OrderRepository } from "../../domain/catalog/repositories/OrderRepository";

export class GetOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(input: { orderId: string }): Promise<Order | null> {
    const orderId = input?.orderId?.trim();

    if (!orderId) {
      throw new Error("Order ID is required");
    }

    return this.orderRepository.findById(orderId);
  }
}
