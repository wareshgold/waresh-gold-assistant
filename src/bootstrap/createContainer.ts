import { AppEnv }
from "../shared/config/env";

import { createStorageModule }
from "./factories/createStorageModule";

import { createCacheModule }
from "./factories/createCacheModule";

import { createMarketModule }
from "./factories/createMarketModule";

import { createGoldModule }
from "./factories/createGoldModule";

import { createSp2lModule }
from "./factories/createSp2lModule";

import { createVIPModule }
from "./factories/createVIPModule";

import { createTelegramModule }
from "./factories/createTelegramModule";

import { createMonitoringModule }
from "./factories/createMonitoringModule";

import { createAIModule }
from "./factories/createAIModule";

import { GetCurrentMarketPriceUseCase }
from "../application/market/GetCurrentMarketPriceUseCase";

import { GetGoldPriceUseCase }
from "../application/usecases/GetGoldPriceUseCase";

import { GetGoldBubbleUseCase }
from "../application/market/GetGoldBubbleUseCase";

import { GetGoldBubbleDataUseCase }
from "../application/market/GetGoldBubbleDataUseCase";

import { GetMarketAnalyticsUseCase }
from "../application/market/GetMarketAnalyticsUseCase";

import { GetMarketHistoryUseCase }
from "../application/market/GetMarketHistoryUseCase";

import {
    GetCurrentGoldPriceUseCase
}
from "../application/gold/GetCurrentGoldPriceUseCase";

import {
    DefaultGoldPriceResolver
}
from "../application/gold/pricing/GoldPriceResolver";

import { GetMarketChartUseCase }
from "../application/market/GetMarketChartUseCase";

import { RefreshMarketPriceUseCase }
from "../application/market/RefreshMarketPriceUseCase";

import { RefreshMarketPriceJob }
from "../application/jobs/RefreshMarketPriceJob";

import { GetSystemMetricsUseCase }
from "../application/system/GetSystemMetricsUseCase";

import { SystemMetricsController }
from "../interfaces/http/SystemMetricsController";

import { HealthCheckService }
from "../application/system/HealthCheckService";

import { SaveGoldCalculationHistoryUseCase }
from "../application/gold/SaveGoldCalculationHistoryUseCase";

import { GetGoldCalculationHistoryUseCase }
from "../application/gold/GetGoldCalculationHistoryUseCase";

export function createContainer(
    env: AppEnv
) {
    const storage =
        createStorageModule(env);

    const cache =
        createCacheModule(env);

    const monitoring =
        createMonitoringModule(env);

    const healthCheckService =
        new HealthCheckService(
            cache.cache,
            storage.snapshotRepository,
            monitoring.metricsStore
        );

    const market =
        createMarketModule(
            env,
            storage,
            cache,
            monitoring
        );

    const gold =
        createGoldModule();

    const sp2l =
        createSp2lModule(
            env
        );

    const vip =
        createVIPModule(
            env
        );

    const saveGoldCalculationHistoryUseCase =
        new SaveGoldCalculationHistoryUseCase(
            storage.goldCalculationHistoryRepository
        );

    const getGoldCalculationHistoryUseCase =
        new GetGoldCalculationHistoryUseCase(
            storage.goldCalculationHistoryRepository
        );

    const getSystemMetricsUseCase =
        new GetSystemMetricsUseCase(
            monitoring.monitoringService
        );

    const systemMetricsController =
        new SystemMetricsController(
            getSystemMetricsUseCase
        );

    const currentMarketPriceUseCase =
        new GetCurrentMarketPriceUseCase(
            market.cachedMarketProvider
        );

    const getCurrentGoldPriceUseCase =
        new GetCurrentGoldPriceUseCase(
            market.cachedMarketProvider
        );

    const getGoldBubbleUseCase =
        new GetGoldBubbleUseCase(
            market.cachedMarketProvider,
            gold.goldBubbleCalculator
        );

    const ai =
        createAIModule(
            env,
            {
                getCurrentGoldPriceUseCase,

                getGoldBubbleUseCase,

                calculateGoldPriceUseCase:
                    gold.calculateGoldPriceUseCase,

                calculateGoldFormulaUseCase:
                    gold.calculateGoldFormulaUseCase,

                calculateReverseGoldUseCase:
                    gold.calculateReverseGoldUseCase,

                calculateInvoiceUseCase:
                    gold.calculateInvoiceUseCase,

                sp2lStrategyService:
                    sp2l.strategyService,

                aiConversationMemory:
                    storage.aiConversationMemory
            }
        );

    const goldPriceResolver =
        new DefaultGoldPriceResolver(
            getCurrentGoldPriceUseCase
        );

    const getGoldPriceUseCase =
        new GetGoldPriceUseCase(
            currentMarketPriceUseCase
        );

    const getGoldBubbleDataUseCase =
        new GetGoldBubbleDataUseCase(
            market.cachedMarketProvider,
            gold.goldBubbleCalculator
        );

    const getMarketAnalyticsUseCase =
        new GetMarketAnalyticsUseCase(
            market.analyticsFacade
        );

    const getMarketHistoryUseCase =
        new GetMarketHistoryUseCase(
            market.snapshotService
        );

    const getMarketChartUseCase =
        new GetMarketChartUseCase(
            market.marketChartService
        );

    const refreshMarketPriceUseCase =
        new RefreshMarketPriceUseCase(
            market.priceRefreshService
        );

    const refreshMarketPriceJob =
        new RefreshMarketPriceJob(
            refreshMarketPriceUseCase
        );

    const telegram =
        createTelegramModule(
            env,
            {
                getGoldPriceUseCase,

                getGoldBubbleUseCase,

                getMarketAnalyticsUseCase,

                getMarketHistoryUseCase,

                getGoldCalculationHistoryUseCase,

                getMarketChartUseCase,

                calculateGoldFormulaUseCase:
                    gold.calculateGoldFormulaUseCase,

                calculateReverseGoldUseCase:
                    gold.calculateReverseGoldUseCase,

                goldCalculationWorkflow:
                    gold.goldCalculationWorkflow,

                sessionStore:
                    storage.sessionStore,

                profileStore:
                    storage.userProfileStore,

                goldPriceResolver,

                saveGoldCalculationHistoryUseCase,

                aiService:
                    ai.aiService,

                vipAccessService:
                    vip.vipAccessService
            }
        );

    return {
        ...cache,
        ...market,
        ...gold,
        ...sp2l,
        ...vip,
        ...telegram,
        ...monitoring,
        ...ai,

        systemMetricsController,

        healthCheckService,

        getSystemMetricsUseCase,

        getGoldPriceUseCase,

        getGoldBubbleUseCase,

        getCurrentGoldPriceUseCase,

        goldPriceResolver,

        getGoldBubbleDataUseCase,

        getMarketAnalyticsUseCase,

        getMarketHistoryUseCase,

        getMarketChartUseCase,

        refreshMarketPriceUseCase,

        refreshMarketPriceJob,

        saveGoldCalculationHistoryUseCase,

        getGoldCalculationHistoryUseCase
    };
}
