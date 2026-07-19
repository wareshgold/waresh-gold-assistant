import {
    MarketPriceProvider
}
from "../../../domain/market/providers/MarketPriceProvider";


import {
    MarketPrice
}
from "../../../domain/market/entities/MarketPrice";


import {
    MarketPriceSource
}
from "../../../domain/market/providers/MarketPriceSource";



export class CompositeMarketPriceProvider
implements MarketPriceProvider {



    constructor(

        private readonly sources:
            MarketPriceSource[]

    ){}



    async getCurrentPrice():
        Promise<MarketPrice> {



        for(
            const source of this.sources
        ){


            try {


                const price =
                    await source.getPrice();



                return new MarketPrice(

                    price.gold18Price,

                    price.currencyPrice,

                    price.ouncePrice,

                    price.updatedAt

                );


            }

            catch(error){


                continue;


            }


        }



        throw new Error(
            "No market price source available"
        );


    }


}