import { createCloudflareKVCacheStore }
from "../infrastructure/cache/CloudflareKVCacheFactory";

import { PriceRefreshService }
from "../application/market/services/PriceRefreshService";

import { RefreshMarketPriceUseCase }
from "../application/market/RefreshMarketPriceUseCase";

import { MarketSnapshotService }
from "../application/market/services/MarketSnapshotService";

import { MarketAnalyticsService }
from "../application/market/services/MarketAnalyticsService";

import { GetMarketAnalyticsUseCase }
from "../application/market/GetMarketAnalyticsUseCase";

import { GetMarketHistoryUseCase }
from "../application/market/GetMarketHistoryUseCase";

import { TrendCalculator }
from "../domain/market/analytics/services/TrendCalculator";

import { VolatilityCalculator }
from "../domain/market/analytics/services/VolatilityCalculator";

import { MemoryMarketSnapshotRepository }
from "../infrastructure/market/repositories/MemoryMarketSnapshotRepository";

import { D1MarketSnapshotRepository }
from "../infrastructure/market/repositories/d1/D1MarketSnapshotRepository";

import { GetGoldPriceUseCase }
from "../application/usecases/GetGoldPriceUseCase";

import { GetGoldBubbleUseCase }
from "../application/market/GetGoldBubbleUseCase";

import { GoldBubbleCalculator }
from "../domain/market/services/GoldBubbleCalculator";

import {
    createTelegramMessageProvider
}
from "../infrastructure/market/sources/TelegramMessageProviderFactory";

import { TelegramMarketPriceSource }
from "../infrastructure/market/sources/TelegramMarketPriceSource";

import { HttpMarketPriceSource }
from "../infrastructure/market/sources/HttpMarketPriceSource";

import { HttpPriceSourceClient }
from "../infrastructure/market/clients/HttpPriceSourceClient";

import { CompositeMarketPriceProvider }
from "../infrastructure/market/providers/CompositeMarketPriceProvider";

import { CachedMarketPriceProvider }
from "../infrastructure/market/providers/CachedMarketPriceProvider";

import { TelegramUpdateMapper }
from "../infrastructure/telegram/TelegramUpdateMapper";

import { TelegramResponseFormatter }
from "../application/telegram/TelegramResponseFormatter";

import { TelegramMessageHandler }
from "../application/telegram/TelegramMessageHandler";

import { TelegramCommandService }
from "../application/telegram/services/TelegramCommandService";

import { TelegramUpdateProcessor }
from "../application/telegram/services/TelegramUpdateProcessor";

import { TelegramWebhookController }
from "../interfaces/telegram/TelegramWebhookController";

import { TelegramWebhookSecurityGuard }
from "../interfaces/telegram/TelegramWebhookSecurityGuard";

import { FakeTelegramBotClient }
from "../infrastructure/telegram/FakeTelegramBotClient";

import { TelegramHttpBotClient }
from "../infrastructure/telegram/clients/TelegramHttpBotClient";

import { TelegramCommandRegistry }
from "../application/telegram/commands/TelegramCommandRegistry";

import { createGoldRuleEngine }
from "../domain/gold/services/createGoldRuleEngine";

import { CalculateGoldFormulaUseCase }
from "../application/gold/CalculateGoldFormulaUseCase";

import { MemoryTelegramSessionStore }
from "../application/telegram/state/MemoryTelegramSessionStore";

import { D1TelegramSessionStore }
from "../application/telegram/state/D1TelegramSessionStore";

import { TelegramConversationManager }
from "../application/telegram/flows/TelegramConversationManager";

import { GoldCalculationConversationFlow }
from "../application/telegram/flows/GoldCalculationConversationFlow";

import { AppEnv }
from "../shared/config/env";



export function createContainer(
    env: AppEnv
) {


    const cache =
        createCloudflareKVCacheStore(
            env.MARKET_CACHE
        );



    const snapshotRepository =

        env.waresh_gold_db

            ? new D1MarketSnapshotRepository(
                env.waresh_gold_db
            )

            : new MemoryMarketSnapshotRepository();



    const snapshotService =

        new MarketSnapshotService(
            snapshotRepository
        );



    const analyticsService =

        new MarketAnalyticsService(

            snapshotRepository,

            new TrendCalculator(),

            new VolatilityCalculator()

        );



    const getMarketAnalyticsUseCase =

        new GetMarketAnalyticsUseCase(
            analyticsService
        );



    const getMarketHistoryUseCase =

        new GetMarketHistoryUseCase(
            snapshotService
        );



    const messageProvider =

        createTelegramMessageProvider(
            env
        );



    const telegramSource =

        new TelegramMarketPriceSource(
            messageProvider
        );



    const httpSource =

        new HttpMarketPriceSource(

            new HttpPriceSourceClient(

                env.MARKET_PRICE_API_URL

            )

        );



    const liveMarketProvider =

        new CompositeMarketPriceProvider([

            telegramSource,

            httpSource

        ]);



    const cachedMarketProvider =

        new CachedMarketPriceProvider(

            liveMarketProvider,

            cache

        );



    const priceRefreshService =

        new PriceRefreshService(

            liveMarketProvider,

            cache,

            snapshotService

        );



    const refreshMarketPriceUseCase =

        new RefreshMarketPriceUseCase(
            priceRefreshService
        );



    const getGoldPriceUseCase =

        new GetGoldPriceUseCase(

            liveMarketProvider

        );



    const getGoldBubbleUseCase =

        new GetGoldBubbleUseCase(

            liveMarketProvider,

            new GoldBubbleCalculator()

        );



    const calculateGoldFormulaUseCase =

        new CalculateGoldFormulaUseCase(

            createGoldRuleEngine()

        );



    const sessionStore =

        env.ENVIRONMENT === "production"

            ? new D1TelegramSessionStore(
                env.waresh_gold_db
            )

            : new MemoryTelegramSessionStore();



    const conversationManager =

        new TelegramConversationManager(

            sessionStore,

            [

                new GoldCalculationConversationFlow(

                    sessionStore,

                    calculateGoldFormulaUseCase

                )

            ]

        );



    const commandRouter =

        TelegramCommandRegistry.create(

            getGoldPriceUseCase,

            getGoldBubbleUseCase,

            getMarketAnalyticsUseCase,

            getMarketHistoryUseCase,

            calculateGoldFormulaUseCase,

            sessionStore

        );



    const telegramCommandService =

        new TelegramCommandService(

            commandRouter,

            conversationManager

        );



    const telegramHandler =

        new TelegramMessageHandler(

            telegramCommandService

        );



    const telegramProcessor =

        new TelegramUpdateProcessor(

            new TelegramUpdateMapper(),

            telegramHandler,

            new TelegramResponseFormatter(),


            env.TELEGRAM_BOT_TOKEN

                ? new TelegramHttpBotClient(
                    env.TELEGRAM_BOT_TOKEN
                )

                : new FakeTelegramBotClient()

        );



    const telegramWebhookController =

        new TelegramWebhookController(

            telegramProcessor,

            new TelegramWebhookSecurityGuard(
                env.TELEGRAM_WEBHOOK_SECRET
            )

        );



    return {

        cache,

        marketProvider: liveMarketProvider,

        cachedMarketProvider,

        priceRefreshService,

        refreshMarketPriceUseCase,

        snapshotService,

        telegramWebhookController

    };


}