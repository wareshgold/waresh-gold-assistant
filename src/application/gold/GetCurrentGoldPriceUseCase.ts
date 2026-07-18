import {
  MarketPriceProvider
} from "../../domain/market/providers/MarketPriceProvider";


export interface GetCurrentGoldPriceOutput {

  price: number;

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

      price:
        marketPrice.gold18Price

    };


  }


}