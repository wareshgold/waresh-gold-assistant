export interface AppEnv {
  ENVIRONMENT: string;
  MARKET_CACHE: KVNamespace;
  MARKET_PRICE_API_URL: string;
}

export function getEnv(env: AppEnv) {
  return {
    environment: env.ENVIRONMENT ?? "development",
    marketPriceApiUrl: env.MARKET_PRICE_API_URL,
    marketCache: env.MARKET_CACHE,
  };
}