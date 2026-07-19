import { MarketPriceProvider } 
from "../../../domain/market/providers/MarketPriceProvider";

import { CacheStore } 
from "../../../infrastructure/cache/CacheStore";

import { MarketPrice } 
from "../../../domain/market/entities/MarketPrice";

import { MarketSnapshotService } 
from "./MarketSnapshotService";



export class PriceRefreshService {



    private readonly cacheKey =
        "market:current-price";



    constructor(

        private readonly provider:
            MarketPriceProvider,


        private readonly cache:
            CacheStore,


        private readonly snapshotService:
            MarketSnapshotService

    ) {}





    async refresh(): Promise<MarketPrice> {



        const price =
            await this.provider.getCurrentPrice();




        await this.cache.set(

            this.cacheKey,

            price,

            1800

        );




        await this.snapshotService.savePrice(

            price,

            "market-provider"

        );




        return price;


    }


}