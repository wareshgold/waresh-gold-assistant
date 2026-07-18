import {
    PriceSourceClient,
    RawMarketPrice
} from "./PriceSourceClient";


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


        const data =
            await response.json() as RawMarketPrice;


        return data;

    }

}