import {
  MarketPriceProvider
} from "../../domain/market/providers/MarketPriceProvider";export interface GetCurrentGoldPriceOutput {

  price: number;

  ouncePrice: number | null;

  dollarPrice: number | null;

  mithqalPrice: number | null;

}



export class GetCurrentGoldPriceUseCase {



  constructor(

    private readonly provider: MarketPriceProvider

  ){}




  async execute():

  Promise<GetCurrentGoldPriceOutput> {



    const marketPrice =

      await this.provider.getCurrentPrice();




    return {

      price: marketPrice.gold18Price,

      ouncePrice: marketPrice.ouncePrice,

      dollarPrice: marketPrice.currencyPrice,

      mithqalPrice: Math.round(marketPrice.gold18Price * 4.608)

    };

  }



}