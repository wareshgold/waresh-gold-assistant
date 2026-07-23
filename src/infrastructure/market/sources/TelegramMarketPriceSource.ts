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

                maxAttempts: 1,

                delayMs: 0

            });



        this.timeoutPolicy =

            new TimeoutPolicy({

                timeoutMs: 6000

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



                        console.log(
                            "TELEGRAM RAW MESSAGE:",
                            message
                        );



                        const parsed =

                            TelegramPriceParser.parse(
                                message
                            );



                        console.log(
                            "TELEGRAM PARSED:",
                            parsed
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