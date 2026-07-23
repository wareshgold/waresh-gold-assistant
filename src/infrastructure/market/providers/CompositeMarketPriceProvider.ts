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


import {
    MetricRecorder
}
from "../../../application/system/observability/MetricRecorder";


import {
    MetricType
}
from "../../../domain/system/observability/MetricType";



export class CompositeMarketPriceProvider

implements MarketPriceProvider {



    constructor(


        private readonly sources:
            MarketPriceSource[],


        private readonly retryPolicy:
            RetryPolicy = new RetryPolicy({

                maxAttempts: 1,

                delayMs: 0

            }),


        private readonly metrics?:
            MetricRecorder


    ) {}








    async getCurrentPrice():

    Promise<MarketPrice> {



        for(

            const source of this.sources

        ) {



            const startTime =

                Date.now();





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







                if(this.metrics) {


                    await this.metrics.record(

                        MetricType.MARKET_FETCH_SUCCESS,

                        1

                    );



                    await this.metrics.record(

                        MetricType.MARKET_FETCH_DURATION,

                        Date.now() - startTime

                    );


                }







                return new MarketPrice(



                    price.gold18Price,



                    price.currencyPrice,



                    price.ouncePrice,



                    price.updatedAt



                );





            }

            catch(error) {



                if(this.metrics) {



                    await this.metrics.record(

                        MetricType.MARKET_FETCH_FAILURE,

                        1

                    );




                    await this.metrics.record(

                        MetricType.MARKET_FETCH_DURATION,

                        Date.now() - startTime

                    );


                }







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