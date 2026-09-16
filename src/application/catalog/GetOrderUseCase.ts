import type { Order } from "../../domain/catalog/entities/Order";
import type { OrderStatusHistoryEntry } from "../../domain/catalog/repositories/OrderRepository";

type OrderLookupRepository = {
  findById(orderId: string): Promise<Order | null>;
  findByCustomerId(customerId: string): Promise<Order[]>;
  getStatusHistory(orderId: string): Promise<OrderStatusHistoryEntry[]>;
};

export type OrderDetails = {
  order: Order;
  statusHistory: OrderStatusHistoryEntry[];
};

export class GetOrderUseCase {
  constructor(private readonly orderRepository: OrderLookupRepository) {}

  async execute(input: { orderId: string; customerId?: string }): Promise<Order | null> {
    const orderId = input?.orderId?.trim();
    if (!orderId) throw new Error("Order ID is required");

    const customerId = input.customerId?.trim();
    if (!customerId) throw new Error("Customer ID is required");

    const order = await this.orderRepository.findById(orderId);
    if (!order) return null;
    if (order.customerId !== customerId) return null;
    return order;
  }

  async executeWithHistory(input: { orderId: string; customerId: string }): Promise<OrderDetails | null> {
    const orderId = input?.orderId?.trim();
    const customerId = input?.customerId?.trim();
    if (!orderId) throw new Error("Order ID is required");
    if (!customerId) throw new Error("Customer ID is required");

    const order = await this.orderRepository.findById(orderId);
    if (!order || order.customerId !== customerId) return null;

    return { order, statusHistory: await this.orderRepository.getStatusHistory(orderId) };
  }

  async executeAdmin(input: { orderId: string }): Promise<Order | null> {
    const orderId = input?.orderId?.trim();
    if (!orderId) throw new Error("شناسه سفارش الزامی است.");
    return this.orderRepository.findById(orderId);
  }

  async executeAdminWithHistory(input: { orderId: string }): Promise<OrderDetails | null> {
    const orderId = input?.orderId?.trim();
    if (!orderId) throw new Error("شناسه سفارش الزامی است.");

    const order = await this.orderRepository.findById(orderId);
    if (!order) return null;

    return { order, statusHistory: await this.orderRepository.getStatusHistory(orderId) };
  }

  async listByCustomerId(customerId: string): Promise<Order[]> {
    const normalizedCustomerId = customerId?.trim();
    if (!normalizedCustomerId) throw new Error("Customer ID is required");
    return this.orderRepository.findByCustomerId(normalizedCustomerId);
  }
}
