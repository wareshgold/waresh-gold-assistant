import {
    MarketPriceSource,
    MarketPriceResult
}
from "../../../domain/market/providers/MarketPriceSource";


import {
    PriceSourceClient
}
from "../clients/PriceSourceClient";


import {
    TimeoutPolicy
}
from "../../resilience/TimeoutPolicy";



export class HttpMarketPriceSource
implements MarketPriceSource {



    private readonly timeoutPolicy:
        TimeoutPolicy;



    constructor(

        private readonly client:
            PriceSourceClient

    ) {


        this.timeoutPolicy =

            new TimeoutPolicy({

                timeoutMs: 3000

            });


    }



    async getPrice():
        Promise<MarketPriceResult> {



        return this.timeoutPolicy.execute(

            async () => {


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

        );


    }


}