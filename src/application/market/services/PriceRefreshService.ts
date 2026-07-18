import { MarketPriceProvider } from "../../../domain/market/providers/MarketPriceProvider";
import { CacheStore } from "../../../infrastructure/cache/CacheStore";
import { MarketPrice } from "../../../domain/market/entities/MarketPrice";


export class PriceRefreshService {


    private readonly cacheKey =
        "market:current-price";


    constructor(
        private readonly provider: MarketPriceProvider,
        private readonly cache: CacheStore
    ) {}



    async refresh(): Promise<MarketPrice> {


        const price =
            await this.provider.getCurrentPrice();



        await this.cache.set(
            this.cacheKey,
            price,
            1800
        );



        return price;

    }

}