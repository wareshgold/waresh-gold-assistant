import { createCloudflareKVCacheStore }
from "../infrastructure/cache/CloudflareKVCacheFactory";

import { PriceRefreshService }
from "../application/market/services/PriceRefreshService";

import { MarketSnapshotService }
from "../application/market/services/MarketSnapshotService";

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

import { TelegramMarketPriceProvider }
from "../infrastructure/market/providers/TelegramMarketPriceProvider";

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

        env.ENVIRONMENT === "production"

            ? new D1MarketSnapshotRepository(
                env.waresh_gold_db
            )

            : new MemoryMarketSnapshotRepository();



    const snapshotService =
        new MarketSnapshotService(
            snapshotRepository
        );



    const messageProvider =
        createTelegramMessageProvider(
            env
        );



    const marketProvider =

        new CachedMarketPriceProvider(

            new TelegramMarketPriceProvider(
                messageProvider
            ),

            cache

        );



    const priceRefreshService =

        new PriceRefreshService(
            marketProvider,
            cache,
            snapshotService
        );



    const getGoldPriceUseCase =

        new GetGoldPriceUseCase(
            marketProvider
        );



    const getGoldBubbleUseCase =

        new GetGoldBubbleUseCase(

            marketProvider,

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

        marketProvider,

        priceRefreshService,

        snapshotService,

        telegramWebhookController

    };


}