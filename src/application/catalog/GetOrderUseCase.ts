import type { Order } from "../../domain/catalog/entities/Order";
import type { OrderRepository } from "../../domain/catalog/repositories/OrderRepository";

export class GetOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(input: { orderId: string; customerId?: string }): Promise<Order | null> {
    const orderId = input?.orderId?.trim();

    if (!orderId) {
      throw new Error("Order ID is required");
    }

    const order = await this.orderRepository.findById(orderId);
    if (!order) return null;

    const customerId = input.customerId?.trim();
    if (order.customerId && order.customerId !== customerId) {
      return null;
    }

    return order;
  }
}
