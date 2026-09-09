import type { Order, OrderStatus } from "../../domain/catalog/entities/Order";
import type { OrderRepository } from "../../domain/catalog/repositories/OrderRepository";

export class MemoryOrderRepository implements OrderRepository {
    private readonly orders = new Map<string, Order>();

    async save(order: Order): Promise<void> {
        this.orders.set(order.orderId, structuredClone(order));
    }

    async updateStatus(orderId: string, status: OrderStatus, updatedAt: string): Promise<void> {
        const order = this.orders.get(orderId);
        if (!order) throw new Error("سفارش پیدا نشد.");
        this.orders.set(orderId, structuredClone({ ...order, status, updatedAt }));
    }

    async findById(orderId: string): Promise<Order | null> {
        const order = this.orders.get(orderId);
        return order ? structuredClone(order) : null;
    }

    async findByQuoteId(quoteId: string): Promise<Order | null> {
        for (const order of this.orders.values()) {
            if (order.quoteId === quoteId) return structuredClone(order);
        }
        return null;
    }

    async findByCustomerId(customerId: string): Promise<Order[]> {
        return [...this.orders.values()]
            .filter((order) => order.customerId === customerId)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((order) => structuredClone(order));
    }
}
