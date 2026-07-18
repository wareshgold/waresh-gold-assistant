import {
    PriceSourceClient,
    RawMarketPrice
} from "./PriceSourceClient";


export class FakePriceSourceClient
implements PriceSourceClient {


    async fetchPrice(): Promise<RawMarketPrice> {

        return {
            gold18Price: 18350000,
            currencyPrice: 188000,
            updatedAt: new Date()
        };

    }

}