import {
    PriceSourceClient,
    RawMarketPrice
} from "./PriceSourceClient";

import { MarketPriceResponseSchema }
from "../schemas/MarketPriceResponseSchema";

import {
    RetryPolicy
}
from "../../resilience/RetryPolicy";



export class HttpPriceSourceClient
implements PriceSourceClient {


    private readonly retryPolicy:
        RetryPolicy;



    constructor(
        private readonly url: string
    ) {


        this.retryPolicy =
            new RetryPolicy({

                maxAttempts: 3,

                delayMs: 500

            });


    }



    async fetchPrice():
        Promise<RawMarketPrice> {


        return this.retryPolicy.execute(

            async () => {


                const response =
                    await fetch(this.url);



                if (!response.ok) {


                    throw new Error(
                        "Failed to fetch market price"
                    );


                }



                const json =
                    await response.json();




                const validated =
                    MarketPriceResponseSchema.parse(json);




                return {


                    gold18Price:
                        validated.gold18Price,



                    currencyPrice:
                        validated.currencyPrice,



                    ouncePrice:
                        validated.ouncePrice,



                    updatedAt:
                        new Date(
                            validated.updatedAt
                        )


                };


            }

        );


    }


}