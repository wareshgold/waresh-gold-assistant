import { MarketPrice } from "../../../domain/market/entities/MarketPrice";
import { MarketPriceProvider } from "../../../domain/market/providers/MarketPriceProvider";
import { PriceSourceClient } from "../clients/PriceSourceClient";
import { MarketPriceMapper } from "../mappers/MarketPriceMapper";


export class HttpMarketPriceProvider 
implements MarketPriceProvider {


    constructor(
        private readonly client: PriceSourceClient
    ) {}


    async getCurrentPrice(): Promise<MarketPrice> {


        const rawPrice =
            await this.client.fetchPrice();


        return MarketPriceMapper.toDomain(
            rawPrice
        );


    }

}