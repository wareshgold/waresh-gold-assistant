import { TelegramPriceParser } from "../../parsers/TelegramPriceParser";
import { PriceSourceClient, RawMarketPrice } from "../PriceSourceClient";


export class TelegramPriceSourceClient
implements PriceSourceClient {


  constructor(
    private readonly messageProvider: () => Promise<string>
  ) {}



  async fetchPrice(): Promise<RawMarketPrice> {


    const message =
      await this.messageProvider();



    const parsed =
      TelegramPriceParser.parse(message);



    return {

      gold18Price:
        parsed.gold18Price,


      currencyPrice:
        parsed.currencyPrice,


      updatedAt:
        new Date()

    };

  }

}