import { PriceSourceClient } from "./PriceSourceClient";
import { RawMarketPrice } from "./PriceSourceClient";


export class FakePriceSourceClient
implements PriceSourceClient {


    async fetchPrice():
        Promise<RawMarketPrice> {


        return {

            gold18Price: 18350000,

            currencyPrice: 188000,

            ouncePrice: 3350,

            updatedAt: new Date()

        };


    }


}