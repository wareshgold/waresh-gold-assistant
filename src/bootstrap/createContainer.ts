import { createCloudflareKVCacheStore } from "../infrastructure/cache/CloudflareKVCacheFactory";
import { HttpPriceSourceClient } from "../infrastructure/market/clients/HttpPriceSourceClient";
import { HttpMarketPriceProvider } from "../infrastructure/market/providers/HttpMarketPriceProvider";
import { PriceRefreshService } from "../application/market/services/PriceRefreshService";
import { AppEnv } from "../shared/config/env";

export function createContainer(env: AppEnv) {

  const cache =
    createCloudflareKVCacheStore(
      env.MARKET_CACHE
    );


  const client =
    new HttpPriceSourceClient(
      env.MARKET_PRICE_API_URL
    );


  const marketProvider =
    new HttpMarketPriceProvider(
      client
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