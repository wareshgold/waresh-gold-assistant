import {
    MarketPriceSource,
    MarketPriceResult
}
from "../../../domain/market/providers/MarketPriceSource";


import {
    MarketMessageProvider
}
from "./MarketMessageProvider";


import {
    TelegramPriceParser
}
from "../parsers/TelegramPriceParser";


import {
    RetryPolicy
}
from "../../resilience/RetryPolicy";


import {
    TimeoutPolicy
}
from "../../resilience/TimeoutPolicy";



export class TelegramMarketPriceSource
implements MarketPriceSource {



    private readonly retryPolicy:
        RetryPolicy;



    private readonly timeoutPolicy:
        TimeoutPolicy;



    constructor(

        private readonly messageProvider:
            MarketMessageProvider

    ){


        this.retryPolicy =

            new RetryPolicy({

                maxAttempts: 3,

                delayMs: 500

            });



        this.timeoutPolicy =

            new TimeoutPolicy({

                timeoutMs: 3000

            });


    }



    async getPrice():
        Promise<MarketPriceResult> {



        return this.retryPolicy.execute(

            async () => {


                return this.timeoutPolicy.execute(

                    async () => {


                        const message =

                            await this.messageProvider
                                .getLatestMessage();



                        const parsed =

                            TelegramPriceParser.parse(
                                message
                            );



                        return {


                            gold18Price:

                                parsed.gold18Price,



                            currencyPrice:

                                parsed.currencyPrice,



                            ouncePrice:

                                parsed.ouncePrice,



                            updatedAt:

                                parsed.updatedAt


                        };


                    }

                );


            }

        );


    }


}