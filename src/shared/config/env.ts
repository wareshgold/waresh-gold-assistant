export interface AppEnv {

    ENVIRONMENT: string;


    MARKET_CACHE: KVNamespace;


    waresh_gold_db: D1Database;


    MARKET_PRICE_API_URL: string;


    TELEGRAM_MARKET_SOURCE_URL?: string;


    TELEGRAM_BOT_TOKEN?: string;


    TELEGRAM_WEBHOOK_SECRET?: string;

}



export function getEnv(
    env: AppEnv
) {

    return {

        environment:
            env.ENVIRONMENT ?? "development",


        marketPriceApiUrl:
            env.MARKET_PRICE_API_URL,


        telegramMarketSourceUrl:
            env.TELEGRAM_MARKET_SOURCE_URL,


        marketCache:
            env.MARKET_CACHE,


        database:
            env.waresh_gold_db,


        telegramBotToken:
            env.TELEGRAM_BOT_TOKEN,


        telegramWebhookSecret:
            env.TELEGRAM_WEBHOOK_SECRET ??
            "development-secret"

    };

}