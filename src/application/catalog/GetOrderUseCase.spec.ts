import { describe, expect, it } from "vitest";
import { GetOrderUseCase } from "./GetOrderUseCase";
import type { Order } from "../../domain/catalog/entities/Order";
import type { OrderRepository } from "../../domain/catalog/repositories/OrderRepository";

const order: Order = {
  orderId: "order-1",
  quoteId: "quote-1",
  customerId: "customer-1",
  address: {
    addressId: "address-1",
    title: "خانه",
    recipientName: "Ali Mirzaei",
    phone: "+989121234567",
    province: "تهران",
    city: "تهران",
    address: "خیابان نمونه",
    postalCode: "1234567890",
  },
  status: "pending_confirmation",
  createdAt: "2026-09-07T08:00:00.000Z",
  updatedAt: "2026-09-07T08:00:00.000Z",
  market: {
    gold18Price: 23549000,
    currencyPrice: 100000,
    ouncePrice: 4500,
    updatedAt: "2026-09-07T07:59:00.000Z",
  },
  items: [],
  total: 1000000,
};

function createUseCase(): GetOrderUseCase {
  const repository: OrderRepository = {
    save: async () => undefined,
    updateStatus: async () => undefined,
    findById: async (orderId) => (orderId === order.orderId ? order : null),
    findByQuoteId: async () => null,
    findByCustomerId: async () => [],
    findAll: async () => [],
  };
  return new GetOrderUseCase(repository);
}

describe("GetOrderUseCase", () => {
  it("retrieves an existing order for its owner", async () => {
    await expect(createUseCase().execute({ orderId: "order-1", customerId: "customer-1" })).resolves.toEqual(order);
  });

  it("hides a customer-linked order from another customer", async () => {
    await expect(createUseCase().execute({ orderId: "order-1", customerId: "customer-2" })).resolves.toBeNull();
  });

  it("returns null for an unknown order", async () => {
    const repository: OrderRepository = {
      save: async () => undefined,
      updateStatus: async () => undefined,
      findById: async () => null,
      findByQuoteId: async () => null,
      findByCustomerId: async () => [],
      findAll: async () => [],
    };
    await expect(new GetOrderUseCase(repository).execute({ orderId: "missing", customerId: "customer-1" })).resolves.toBeNull();
  });

  it("rejects an empty order id", async () => {
    await expect(createUseCase().execute({ orderId: "   " })).rejects.toThrow("Order ID is required");
  });
});
