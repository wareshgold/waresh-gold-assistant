export interface AppEnv {

    ENVIRONMENT: string;

    MARKET_CACHE: KVNamespace;

    waresh_gold_db: D1Database;

    MARKET_PRICE_API_URL: string;

    TELEGRAM_MARKET_SOURCE_URL?: string;

    TELEGRAM_BOT_TOKEN?: string;

    TELEGRAM_WEBHOOK_SECRET?: string;

    MARKET_SOURCE_RETRY_COUNT?: string;

    MARKET_SOURCE_RETRY_DELAY_MS?: string;

    NVIDIA_API_KEY?: string;

    NVIDIA_API_URL?: string;

    OWNER_TELEGRAM_USER_IDS?: string;

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
            "development-secret",

        marketSourceRetryCount:
            Number(
                env.MARKET_SOURCE_RETRY_COUNT ??
                "2"
            ),

        marketSourceRetryDelayMs:
            Number(
                env.MARKET_SOURCE_RETRY_DELAY_MS ??
                "200"
            ),

        nvidiaApiKey:
            env.NVIDIA_API_KEY,

        nvidiaApiUrl:
            env.NVIDIA_API_URL ??
            "https://integrate.api.nvidia.com/v1/chat/completions",

        ownerTelegramUserIds:
            env.OWNER_TELEGRAM_USER_IDS

    };

}