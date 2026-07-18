import { GoldPriceProvider } 
from "../../domain/market/interfaces/GoldPriceProvider";


export interface GetCurrentGoldPriceOutput {

  gold18Price: number;

  currencyPrice: number;

  updatedAt: Date;

}



export class GetCurrentGoldPriceUseCase {


  constructor(
    private readonly provider: GoldPriceProvider
  ){}



  async execute()
  : Promise<GetCurrentGoldPriceOutput> {


    const price =
      await this.provider.getCurrentPrice();



    return {

      gold18Price:
        price.gold18Price,


      currencyPrice:
        price.currencyPrice,


      updatedAt:
        price.updatedAt

    };


  }


}