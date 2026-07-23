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


import {
    RetryPolicy
}
from "../../resilience/RetryPolicy";



export class CompositeMarketPriceProvider
implements MarketPriceProvider {



    constructor(

        private readonly sources:
            MarketPriceSource[],


        private readonly retryPolicy:
            RetryPolicy = new RetryPolicy({

                maxAttempts: 1,

                delayMs: 0

            })

    ){}



    async getCurrentPrice():
        Promise<MarketPrice> {



        for(
            const source of this.sources
        ){


            try {


                const price =

                    await Promise.race([


                        this.retryPolicy.execute(

                            () =>
                                source.getPrice()

                        ),



                        new Promise<never>(

                            (_, reject) => {


                                setTimeout(

                                    () => reject(

                                        new Error(
                                            "Market source timeout"
                                        )

                                    ),

                                    6000

                                );


                            }

                        )


                    ]);



                return new MarketPrice(


                    price.gold18Price,


                    price.currencyPrice,


                    price.ouncePrice,


                    price.updatedAt


                );


            }

            catch(error){


                console.error(

                    "Market price source failed:",

                    source.constructor.name,

                    error

                );


                continue;


            }


        }



        throw new Error(

            "No market price source available"

        );


    }


}