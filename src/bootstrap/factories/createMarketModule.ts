import { MarketSnapshotService }
from "../../application/market/services/MarketSnapshotService";

import { MarketAnalyticsService }
from "../../application/market/services/MarketAnalyticsService";

import { PriceRefreshService }
from "../../application/market/services/PriceRefreshService";

import { TrendCalculator }
from "../../domain/market/analytics/services/TrendCalculator";

import { VolatilityCalculator }
from "../../domain/market/analytics/services/VolatilityCalculator";

import { HttpPriceSourceClient }
from "../../infrastructure/market/clients/HttpPriceSourceClient";

import { HttpMarketPriceSource }
from "../../infrastructure/market/sources/HttpMarketPriceSource";

import { TelegramMarketPriceSource }
from "../../infrastructure/market/sources/TelegramMarketPriceSource";

import {
    createTelegramMessageProvider
}
from "../../infrastructure/market/sources/TelegramMessageProviderFactory";

import { CompositeMarketPriceProvider }
from "../../infrastructure/market/providers/CompositeMarketPriceProvider";

import { CachedMarketPriceProvider }
from "../../infrastructure/market/providers/CachedMarketPriceProvider";

import { AppEnv }
from "../../shared/config/env";


interface StorageModule {


    snapshotRepository:
        import("../../domain/market/repositories/MarketSnapshotRepository")
        .MarketSnapshotRepository;


}



interface CacheModule {


    cache:
        import("../../infrastructure/cache/CacheStore")
        .CacheStore;


}



export interface MarketModule {


    cache:
        CacheModule["cache"];


    marketProvider:
        CompositeMarketPriceProvider;


    cachedMarketProvider:
        CachedMarketPriceProvider;


    snapshotService:
        MarketSnapshotService;


    analyticsService:
        MarketAnalyticsService;


    priceRefreshService:
        PriceRefreshService;

}



export function createMarketModule(

    env: AppEnv,

    storage: StorageModule,

    cacheModule: CacheModule

)
: MarketModule {



    const snapshotService =

        new MarketSnapshotService(

            storage.snapshotRepository

        );



    const analyticsService =

        new MarketAnalyticsService(

            storage.snapshotRepository,

            new TrendCalculator(),

            new VolatilityCalculator()

        );



    const telegramSource =

        new TelegramMarketPriceSource(

            createTelegramMessageProvider(
                env
            )

        );



    const httpSource =

        new HttpMarketPriceSource(

            new HttpPriceSourceClient(

                env.MARKET_PRICE_API_URL

            )

        );



    const marketProvider =

        new CompositeMarketPriceProvider([

            telegramSource,

            httpSource

        ]);



    const cachedMarketProvider =

        new CachedMarketPriceProvider(

            marketProvider,

            cacheModule.cache

        );



    const priceRefreshService =

        new PriceRefreshService(

            marketProvider,

            cacheModule.cache,

            snapshotService

        );



    return {


        cache:
            cacheModule.cache,


        marketProvider,


        cachedMarketProvider,


        snapshotService,


        analyticsService,


        priceRefreshService


    };


}