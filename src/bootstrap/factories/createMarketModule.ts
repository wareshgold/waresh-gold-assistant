import { MarketSnapshotService }
from "../../application/market/services/MarketSnapshotService";

import { MarketAnalyticsService }
from "../../application/market/services/MarketAnalyticsService";

import { MarketAnalyticsFacade }
from "../../application/market/services/MarketAnalyticsFacade";

import { MarketChartService }
from "../../application/market/chart/MarketChartService";

import { PriceRefreshService }
from "../../application/market/services/PriceRefreshService";

import { TrendCalculator }
from "../../domain/market/analytics/services/TrendCalculator";

import { VolatilityCalculator }
from "../../domain/market/analytics/services/VolatilityCalculator";

import { MarketScoreCalculator }
from "../../domain/market/analytics/services/MarketScoreCalculator";

import { MarketPriceSource }
from "../../domain/market/providers/MarketPriceSource";

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

interface MonitoringModule {
    monitoringService:
        import("../../application/system/observability/SystemMonitoringService")
        .SystemMonitoringService;
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
    marketChartService:
        MarketChartService;
    analyticsFacade:
        MarketAnalyticsFacade;
    priceRefreshService:
        PriceRefreshService;
}

function isUsableHttpMarketUrl(
    url: string | undefined
): url is string {
    if (!url) {
        return false;
    }

    try {
        const parsed = new URL(url);

        return (
            (parsed.protocol === "http:" ||
                parsed.protocol === "https:") &&
            parsed.hostname !== "example.com"
        );
    } catch {
        return false;
    }
}

export function createMarketModule(
    env: AppEnv,
    storage: StorageModule,
    cacheModule: CacheModule,
    monitoring: MonitoringModule
): MarketModule {
    const snapshotService =
        new MarketSnapshotService(
            storage.snapshotRepository
        );

    const marketChartService =
        new MarketChartService(
            storage.snapshotRepository
        );

    const analyticsService =
        new MarketAnalyticsService(
            storage.snapshotRepository,
            new TrendCalculator(),
            new VolatilityCalculator()
        );

    const analyticsFacade =
        new MarketAnalyticsFacade(
            analyticsService,
            new MarketScoreCalculator()
        );

    const telegramSource =
        new TelegramMarketPriceSource(
            createTelegramMessageProvider(env)
        );

    const sources: MarketPriceSource[] = [
        telegramSource
    ];

    if (
        isUsableHttpMarketUrl(
            env.MARKET_PRICE_API_URL
        )
    ) {
        sources.push(
            new HttpMarketPriceSource(
                new HttpPriceSourceClient(
                    env.MARKET_PRICE_API_URL
                )
            )
        );
    }

    const marketProvider =
        new CompositeMarketPriceProvider(
            sources,
            undefined,
            monitoring.monitoringService
        );

    const cachedMarketProvider =
        new CachedMarketPriceProvider(
            marketProvider,
            cacheModule.cache,
            storage.snapshotRepository,
            monitoring.monitoringService
        );

    const priceRefreshService =
        new PriceRefreshService(
            marketProvider,
            cacheModule.cache,
            snapshotService
        );

    return {
        cache: cacheModule.cache,
        marketProvider,
        cachedMarketProvider,
        snapshotService,
        marketChartService,
        analyticsFacade,
        priceRefreshService
    };
}
