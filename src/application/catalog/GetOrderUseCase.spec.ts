import { describe, expect, it } from "vitest";
import { GetOrderUseCase } from "./GetOrderUseCase";
import type { Order } from "../../domain/catalog/entities/Order";
import type { OrderRepository } from "../../domain/catalog/repositories/OrderRepository";

const order: Order = {
  orderId: "order-1",
  quoteId: "quote-1",
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

describe("GetOrderUseCase", () => {
  it("retrieves an existing order", async () => {
    const repository: OrderRepository = {
      save: async () => undefined,
      findById: async (orderId) => (orderId === order.orderId ? order : null),
      findByQuoteId: async () => null,
    };

    const useCase = new GetOrderUseCase(repository);

    await expect(useCase.execute({ orderId: "order-1" })).resolves.toEqual(order);
  });

  it("returns null for an unknown order", async () => {
    const repository: OrderRepository = {
      save: async () => undefined,
      findById: async () => null,
      findByQuoteId: async () => null,
    };

    const useCase = new GetOrderUseCase(repository);

    await expect(useCase.execute({ orderId: "missing" })).resolves.toBeNull();
  });

  it("rejects an empty order id", async () => {
    const repository: OrderRepository = {
      save: async () => undefined,
      findById: async () => null,
      findByQuoteId: async () => null,
    };

    const useCase = new GetOrderUseCase(repository);

    await expect(useCase.execute({ orderId: "   " })).rejects.toThrow("Order ID is required");
  });
});
