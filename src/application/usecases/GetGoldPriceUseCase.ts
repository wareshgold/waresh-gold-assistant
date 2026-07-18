import { PriceSourceClient } from "../../infrastructure/market/clients/PriceSourceClient";

export class GetGoldPriceUseCase {

  constructor(
    private readonly priceSourceClient: PriceSourceClient
  ) {}


  async execute() {

    const price =
      await this.priceSourceClient.fetchPrice();


    return {
      metal: "gold",
      price: price.gold18Price,
      currency: "IRR",
      updatedAt: price.updatedAt
    };

  }

}