import { createCloudflareKVCacheStore } from "../infrastructure/cache/CloudflareKVCacheFactory";

import { HttpPriceSourceClient } from "../infrastructure/market/clients/HttpPriceSourceClient";
import { FakePriceSourceClient } from "../infrastructure/market/clients/FakePriceSourceClient";

import { HttpMarketPriceProvider } from "../infrastructure/market/providers/HttpMarketPriceProvider";

import { PriceRefreshService } from "../application/market/services/PriceRefreshService";

import { GetGoldPriceUseCase } from "../application/usecases/GetGoldPriceUseCase";

import { TelegramUpdateMapper } from "../infrastructure/telegram/TelegramUpdateMapper";

import { TelegramResponseFormatter } from "../application/telegram/TelegramResponseFormatter";

import { TelegramMessageHandler } from "../application/telegram/TelegramMessageHandler";

import { TelegramCommandService } from "../application/telegram/services/TelegramCommandService";

import { TelegramUpdateProcessor } from "../application/telegram/services/TelegramUpdateProcessor";

import { TelegramWebhookController } from "../interfaces/telegram/TelegramWebhookController";

import { TelegramWebhookSecurityGuard } from "../interfaces/telegram/TelegramWebhookSecurityGuard";

import { FakeTelegramBotClient } from "../infrastructure/telegram/FakeTelegramBotClient";

import { AppEnv } from "../shared/config/env";

import { TelegramCommandRegistry } from "../application/telegram/commands/TelegramCommandRegistry";

import { TelegramCommandRouter } from "../application/telegram/commands/TelegramCommandRouter";


export function createContainer(
    env: AppEnv
) {


    const cache =
        createCloudflareKVCacheStore(
            env.MARKET_CACHE
        );



    const priceSourceClient =
        env.ENVIRONMENT === "production"

            ? new HttpPriceSourceClient(
                env.MARKET_PRICE_API_URL
            )

            : new FakePriceSourceClient();



    const marketProvider =
        new HttpMarketPriceProvider(
            priceSourceClient
        );



    const priceRefreshService =
        new PriceRefreshService(
            marketProvider,
            cache
        );



    const getGoldPriceUseCase =
        new GetGoldPriceUseCase(
            priceSourceClient
        );



    const commandHandlers =
        TelegramCommandRegistry.create(
            getGoldPriceUseCase
        );



    const commandRouter =
        new TelegramCommandRouter(
            commandHandlers
        );



    const telegramCommandService =
        new TelegramCommandService(
            commandRouter
        );



    const telegramMapper =
        new TelegramUpdateMapper();



    const telegramFormatter =
        new TelegramResponseFormatter();



    const telegramHandler =
        new TelegramMessageHandler(
            telegramCommandService,
            telegramFormatter
        );



    const telegramBotClient =
        new FakeTelegramBotClient();



    const telegramProcessor =
        new TelegramUpdateProcessor(
            telegramMapper,
            telegramHandler,
            telegramFormatter,
            telegramBotClient
        );



    const telegramSecurityGuard =
        new TelegramWebhookSecurityGuard(
            env.TELEGRAM_WEBHOOK_SECRET
        );



    const telegramWebhookController =
        new TelegramWebhookController(
            telegramProcessor,
            telegramSecurityGuard
        );



    return {

        cache,

        marketProvider,

        priceRefreshService,

        telegramWebhookController

    };


}