import {
    PriceSourceClient,
    RawMarketPrice
} from "./PriceSourceClient";

import { MarketPriceResponseSchema } 
from "../schemas/MarketPriceResponseSchema";


export class HttpPriceSourceClient
implements PriceSourceClient {


    constructor(
        private readonly url: string
    ) {}


    async fetchPrice(): Promise<RawMarketPrice> {


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


            updatedAt:
                new Date(
                    validated.updatedAt
                )

        };

    }

}