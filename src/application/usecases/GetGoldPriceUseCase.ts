import { PriceSourceClient } from "../../infrastructure/market/clients/PriceSourceClient";

export class GetGoldPriceUseCase {
  constructor(
    private readonly priceSourceClient: PriceSourceClient
  ) {}

  async execute() {
    const price = await this.priceSourceClient.getPrice();

    return {
      metal: "gold",
      price: price.price,
      currency: "IRR",
      updatedAt: new Date()
    };
  }
}