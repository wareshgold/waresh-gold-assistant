import type { Order } from "../entities/Order";

export interface OrderRepository {
    save(order: Order): Promise<void>;
    findById(orderId: string): Promise<Order | null>;
    findByQuoteId(quoteId: string): Promise<Order | null>;
    findByCustomerId(customerId: string): Promise<Order[]>;
}
