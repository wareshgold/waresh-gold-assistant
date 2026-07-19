import { MarketPrice } from "../../../domain/market/entities/MarketPrice";
import { MarketPriceProvider } from "../../../domain/market/providers/MarketPriceProvider";


export class MockMarketPriceProvider
implements MarketPriceProvider {


    async getCurrentPrice(): Promise<MarketPrice> {


        return new MarketPrice(

            18300000,

            187000,

            3350,

            new Date()

        );


    }


}