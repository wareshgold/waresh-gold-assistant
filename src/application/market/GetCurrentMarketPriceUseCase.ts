import { MarketPrice }
from "../../domain/market/entities/MarketPrice";

import { MarketPriceProvider }
from "../../domain/market/providers/MarketPriceProvider";



export class GetCurrentMarketPriceUseCase {



    constructor(

        private readonly marketPriceProvider:
            MarketPriceProvider

    ) {}





    async execute():

        Promise<MarketPrice> {


        return this.marketPriceProvider
            .getCurrentPrice();


    }


}