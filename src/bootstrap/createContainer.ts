import { createCloudflareKVCacheStore } from "../infrastructure/cache/CloudflareKVCacheFactory";

import { HttpPriceSourceClient } from "../infrastructure/market/clients/HttpPriceSourceClient";
import { FakePriceSourceClient } from "../infrastructure/market/clients/FakePriceSourceClient";

import { HttpMarketPriceProvider } from "../infrastructure/market/providers/HttpMarketPriceProvider";

import { PriceRefreshService } from "../application/market/services/PriceRefreshService";

import { GetGoldPriceUseCase } from "../application/usecases/GetGoldPriceUseCase";

import { TelegramUpdateMapper } from "../infrastructure/telegram/TelegramUpdateMapper";
import { FakeTelegramBotClient } from "../infrastructure/telegram/FakeTelegramBotClient";

import { TelegramResponseFormatter } from "../application/telegram/TelegramResponseFormatter";
import { TelegramMessageHandler } from "../application/telegram/TelegramMessageHandler";
import { TelegramCommandService } from "../application/telegram/services/TelegramCommandService";
import { TelegramUpdateProcessor } from "../application/telegram/services/TelegramUpdateProcessor";

import { TelegramWebhookController } from "../interfaces/telegram/TelegramWebhookController";

import { AppEnv } from "../shared/config/env";


export function createContainer(env: AppEnv) {


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



  const telegramMapper =
    new TelegramUpdateMapper();



  const telegramFormatter =
    new TelegramResponseFormatter();



  const telegramCommandService =
    new TelegramCommandService(
      getGoldPriceUseCase
    );



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



  const telegramWebhookController =
    new TelegramWebhookController(
      telegramProcessor
    );



  return {

    cache,

    marketProvider,

    priceRefreshService,

    telegramWebhookController

  };


}