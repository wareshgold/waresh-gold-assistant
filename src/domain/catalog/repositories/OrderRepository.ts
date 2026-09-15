import type { Order, OrderStatus } from "../entities/Order";

export interface OrderRepository {
    save(order: Order): Promise<void>;
    updateStatus(orderId: string, expectedStatus: OrderStatus, status: OrderStatus, updatedAt: string): Promise<boolean>;
    cancelForCustomer(orderId: string, customerId: string, fromStatuses: readonly OrderStatus[], updatedAt: string): Promise<boolean>;
    findById(orderId: string): Promise<Order | null>;
    findByQuoteId(quoteId: string): Promise<Order | null>;
    findByCustomerId(customerId: string): Promise<Order[]>;
    findAll(): Promise<Order[]>;
}
