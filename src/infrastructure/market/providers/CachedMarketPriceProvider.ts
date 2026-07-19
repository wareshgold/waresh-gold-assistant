import { MarketPrice } from "../../../domain/market/entities/MarketPrice";
import { MarketPriceProvider } from "../../../domain/market/providers/MarketPriceProvider";
import { CacheStore } from "../../cache/CacheStore";



export class CachedMarketPriceProvider
implements MarketPriceProvider {



    private readonly cacheKey =
        "market:current-price";



    constructor(

        private readonly fallbackProvider:
            MarketPriceProvider,

        private readonly cache:
            CacheStore

    ) {}



    async getCurrentPrice(): Promise<MarketPrice> {



        const cached =
            await this.cache.get<MarketPrice>(
                this.cacheKey
            );



        if (cached) {


            return {

                ...cached,

                updatedAt:
                    new Date(
                        cached.updatedAt
                    )

            };

        }





        const freshPrice =
            await this.fallbackProvider
                .getCurrentPrice();





        await this.cache.set(

            this.cacheKey,

            freshPrice,

            1800

        );





        return freshPrice;


    }


}