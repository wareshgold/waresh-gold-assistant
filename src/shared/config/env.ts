export interface AppEnv {

  ENVIRONMENT: string;

  MARKET_CACHE: KVNamespace;

  MARKET_PRICE_API_URL: string;

  TELEGRAM_BOT_TOKEN: string;

  TELEGRAM_WEBHOOK_SECRET: string;

}



export function getEnv(
  env: AppEnv
) {

  return {

    environment:
      env.ENVIRONMENT ?? "development",


    marketPriceApiUrl:
      env.MARKET_PRICE_API_URL,


    marketCache:
      env.MARKET_CACHE,


    telegramBotToken:
      env.TELEGRAM_BOT_TOKEN,


    telegramWebhookSecret:
      env.TELEGRAM_WEBHOOK_SECRET

  };

}