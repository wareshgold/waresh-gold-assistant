import { MarketPrice } from "../../../domain/market/entities/MarketPrice";
import { MarketPriceProvider } from "../../../domain/market/providers/MarketPriceProvider";
import { CacheStore } from "../../../infrastructure/cache/CacheStore";


export class PriceCacheService {

    private readonly cacheKey =
        "market:current-price";


    constructor(
        private readonly provider: MarketPriceProvider,
        private readonly cache: CacheStore
    ) {}


    async getCurrentPrice(): Promise<MarketPrice> {


        const cached =
            await this.cache.get<MarketPrice>(
                this.cacheKey
            );


        if (cached) {
            return cached;
        }



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