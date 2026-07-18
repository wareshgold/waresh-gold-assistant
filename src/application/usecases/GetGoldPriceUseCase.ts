import { PriceSourceClient } from "../../infrastructure/market/clients/PriceSourceClient";
import { ApplicationResponse } from "../common/models/ApplicationResponse";


export class GetGoldPriceUseCase {

  constructor(
    private readonly priceSourceClient: PriceSourceClient
  ) {}


  async execute(): Promise<ApplicationResponse> {

    const price =
      await this.priceSourceClient.fetchPrice();


    return {

      type: "text",

      content:
        [
          "🟡 قیمت طلا",
          "",
          `قیمت: ${price.gold18Price}`,
          `واحد: IRR`,
          `زمان: ${price.updatedAt.toISOString()}`
        ].join("\n"),


      metadata: {

        gold18Price:
          price.gold18Price,

        currencyPrice:
          price.currencyPrice,

        updatedAt:
          price.updatedAt

      }

    };

  }

}