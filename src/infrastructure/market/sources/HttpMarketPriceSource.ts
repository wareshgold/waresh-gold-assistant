import {
    MarketPriceSource,
    MarketPriceResult
}
from "../../../domain/market/providers/MarketPriceSource";


import {
    PriceSourceClient
}
from "../clients/PriceSourceClient";



export class HttpMarketPriceSource
implements MarketPriceSource {



    constructor(

        private readonly client:
            PriceSourceClient

    ) {}



    async getPrice():
        Promise<MarketPriceResult> {



        const rawPrice =
            await this.client.fetchPrice();



        return {


            gold18Price:
                rawPrice.gold18Price,



            currencyPrice:
                rawPrice.currencyPrice,



            ouncePrice:
                rawPrice.ouncePrice,



            updatedAt:
                rawPrice.updatedAt


        };


    }


}