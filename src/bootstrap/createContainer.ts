import { createCloudflareKVCacheStore }
from "../infrastructure/cache/CloudflareKVCacheFactory";

import { PriceRefreshService }
from "../application/market/services/PriceRefreshService";

import { GetGoldPriceUseCase }
from "../application/usecases/GetGoldPriceUseCase";

import { GetGoldBubbleUseCase }
from "../application/market/GetGoldBubbleUseCase";

import { GoldBubbleCalculator }
from "../domain/market/services/GoldBubbleCalculator";


import { FakeTelegramChannelMessageProvider }
from "../infrastructure/market/sources/FakeTelegramChannelMessageProvider";

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


import { AppEnv }
from "../shared/config/env";


import { TelegramCommandRegistry }
from "../application/telegram/commands/TelegramCommandRegistry";




export function createContainer(
    env: AppEnv
) {



    const cache =
        createCloudflareKVCacheStore(
            env.MARKET_CACHE
        );





    const messageProvider =
        new FakeTelegramChannelMessageProvider();





    const telegramMarketProvider =
        new TelegramMarketPriceProvider(
            messageProvider
        );





    const marketProvider =
        new CachedMarketPriceProvider(
            telegramMarketProvider,
            cache
        );






    const priceRefreshService =
        new PriceRefreshService(
            marketProvider,
            cache
        );






    const getGoldPriceUseCase =
        new GetGoldPriceUseCase(
            marketProvider
        );






    const goldBubbleCalculator =
        new GoldBubbleCalculator();





    const getGoldBubbleUseCase =
        new GetGoldBubbleUseCase(
            marketProvider,
            goldBubbleCalculator
        );






    const commandRouter =
        TelegramCommandRegistry.create(
            getGoldPriceUseCase,
            getGoldBubbleUseCase
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

        env.TELEGRAM_BOT_TOKEN

            ? new TelegramHttpBotClient(
                env.TELEGRAM_BOT_TOKEN
            )

            : new FakeTelegramBotClient();






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