import {
    MarketPrice
}
from "../../../domain/market/entities/MarketPrice";


import {
    MarketPriceProvider
}
from "../../../domain/market/providers/MarketPriceProvider";


import {
    CacheStore
}
from "../../cache/CacheStore";



export class ResilientMarketPriceProvider
implements MarketPriceProvider {



    private readonly lastKnownKey =
        "market:last-known-price";



    constructor(

        private readonly primaryProvider:
            MarketPriceProvider,


        private readonly cache:
            CacheStore

    ) {}





    async getCurrentPrice():
        Promise<MarketPrice> {



        try {


            const price =

                await this.primaryProvider
                    .getCurrentPrice();



            await this.cache.set(

                this.lastKnownKey,

                price

            );



            return price;



        }
        catch(error) {



            const cached =

                await this.cache.get<MarketPrice>(

                    this.lastKnownKey

                );



            if (cached) {


                return new MarketPrice(

                    cached.gold18Price,

                    cached.currencyPrice,

                    cached.ouncePrice,

                    new Date(
                        cached.updatedAt
                    )

                );


            }



            throw error;


        }


    }


}