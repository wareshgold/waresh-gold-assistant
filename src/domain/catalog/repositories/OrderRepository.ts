import type { Order, OrderStatus } from "../entities/Order";

export interface OrderRepository {
    save(order: Order): Promise<void>;
    updateStatus(orderId: string, status: OrderStatus, updatedAt: string): Promise<void>;
    findById(orderId: string): Promise<Order | null>;
    findByQuoteId(quoteId: string): Promise<Order | null>;
    findByCustomerId(customerId: string): Promise<Order[]>;
}
