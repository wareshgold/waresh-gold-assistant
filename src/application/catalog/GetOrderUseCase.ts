import type { Order } from "../../domain/catalog/entities/Order";
import type { OrderRepository } from "../../domain/catalog/repositories/OrderRepository";

export class GetOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(input: { orderId: string; customerId?: string }): Promise<Order | null> {
    const orderId = input?.orderId?.trim();
    if (!orderId) throw new Error("Order ID is required");

    const order = await this.orderRepository.findById(orderId);
    if (!order) return null;

    const customerId = input.customerId?.trim();
    if (order.customerId && order.customerId !== customerId) return null;
    return order;
  }

  async executeAdmin(input: { orderId: string }): Promise<Order | null> {
    const orderId = input?.orderId?.trim();
    if (!orderId) throw new Error("شناسه سفارش الزامی است.");
    return this.orderRepository.findById(orderId);
  }

  async listByCustomerId(customerId: string): Promise<Order[]> {
    const normalizedCustomerId = customerId?.trim();
    if (!normalizedCustomerId) throw new Error("Customer ID is required");
    return this.orderRepository.findByCustomerId(normalizedCustomerId);
  }
}
