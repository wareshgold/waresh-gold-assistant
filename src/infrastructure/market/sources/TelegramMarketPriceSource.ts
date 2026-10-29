import {
    MarketPriceSource,
    MarketPriceResult
} from "../../../domain/market/providers/MarketPriceSource";
import { MarketMessageProvider } from "./MarketMessageProvider";
import { TelegramPriceParser } from "../parsers/TelegramPriceParser";
import { RetryPolicy } from "../../resilience/RetryPolicy";
import { TimeoutPolicy } from "../../resilience/TimeoutPolicy";

export class TelegramMarketPriceSource implements MarketPriceSource {
    private readonly retryPolicy = new RetryPolicy({
        maxAttempts: 1,
        delayMs: 0
    });

    private readonly timeoutPolicy = new TimeoutPolicy({
        timeoutMs: 30000
    });

    constructor(
        private readonly messageProvider: MarketMessageProvider,
        private readonly maxPriceAgeMs: number = 90 * 60 * 1000
    ) {}

    async getPrice(): Promise<MarketPriceResult> {
        return this.retryPolicy.execute(async () => {
            return this.timeoutPolicy.execute(async () => {
                const message = await this.messageProvider.getLatestMessage();
                const parsed = TelegramPriceParser.parse(message);
                const ageMs = Date.now() - parsed.updatedAt.getTime();

                if (ageMs > this.maxPriceAgeMs) {
                    throw new Error(
                        `Telegram market price is stale (${Math.floor(ageMs / 60000)} minutes old)`
                    );
                }

                if (ageMs < -5 * 60 * 1000) {
                    throw new Error("Telegram market price timestamp is in the future");
                }

                console.log("TELEGRAM PARSED:", parsed);

                return {
                    gold18Price: parsed.gold18Price,
                    currencyPrice: parsed.currencyPrice,
                    ouncePrice: parsed.ouncePrice,
                    updatedAt: parsed.updatedAt
                };
            });
        });
    }
}
