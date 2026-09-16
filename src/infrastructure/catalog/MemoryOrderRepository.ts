import type { Order, OrderStatus } from "../../domain/catalog/entities/Order";
import type { OrderRepository, OrderStatusHistoryEntry } from "../../domain/catalog/repositories/OrderRepository";

export class MemoryOrderRepository implements OrderRepository {
    private readonly orders = new Map<string, Order>();
    private readonly statusHistory = new Map<string, OrderStatusHistoryEntry[]>();

    async save(order: Order): Promise<void> {
        this.orders.set(order.orderId, structuredClone(order));
        if (!this.statusHistory.has(order.orderId)) {
            this.statusHistory.set(order.orderId, [{
                orderId: order.orderId,
                fromStatus: null,
                toStatus: order.status,
                changedAt: order.createdAt,
            }]);
        }
    }

    async updateStatus(orderId: string, expectedStatus: OrderStatus, status: OrderStatus, updatedAt: string): Promise<boolean> {
        const order = this.orders.get(orderId);
        if (!order || order.status !== expectedStatus) return false;
        this.orders.set(orderId, structuredClone({ ...order, status, updatedAt }));
        this.appendHistory(orderId, { fromStatus: expectedStatus, toStatus: status, changedAt: updatedAt });
        return true;
    }

    async cancelForCustomer(orderId: string, customerId: string, fromStatuses: readonly OrderStatus[], updatedAt: string): Promise<boolean> {
        const order = this.orders.get(orderId);
        if (!order || order.customerId !== customerId || !fromStatuses.includes(order.status)) return false;
        const fromStatus = order.status;
        this.orders.set(orderId, structuredClone({ ...order, status: "cancelled", updatedAt }));
        this.appendHistory(orderId, { fromStatus, toStatus: "cancelled", changedAt: updatedAt });
        return true;
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

    async findAll(): Promise<Order[]> {
        return [...this.orders.values()]
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((order) => structuredClone(order));
    }

    async getStatusHistory(orderId: string): Promise<OrderStatusHistoryEntry[]> {
        return structuredClone(this.statusHistory.get(orderId) ?? []);
    }

    private appendHistory(orderId: string, entry: Omit<OrderStatusHistoryEntry, "orderId">): void {
        const history = this.statusHistory.get(orderId) ?? [];
        history.push({ orderId, ...entry });
        this.statusHistory.set(orderId, history);
    }
}
