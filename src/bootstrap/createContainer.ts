import { createCloudflareKVCacheStore } from "../infrastructure/cache/CloudflareKVCacheFactory";

import { HttpPriceSourceClient } from "../infrastructure/market/clients/HttpPriceSourceClient";
import { FakePriceSourceClient } from "../infrastructure/market/clients/FakePriceSourceClient";

import { HttpMarketPriceProvider } from "../infrastructure/market/providers/HttpMarketPriceProvider";

import { PriceRefreshService } from "../application/market/services/PriceRefreshService";

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



  return {
    cache,
    marketProvider,
    priceRefreshService,
  };

}