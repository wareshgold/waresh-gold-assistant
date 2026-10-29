import { MarketMessageProvider } from "./MarketMessageProvider";
import { TelegramPriceParser } from "../parsers/TelegramPriceParser";

export class TelegramChannelScraperMessageProvider implements MarketMessageProvider {
    constructor(
        private readonly channelUrl: string,
        private readonly timeoutMs: number = 5000
    ) {}

    async getLatestMessage(): Promise<string> {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

        try {
            console.log("TELEGRAM FETCH START", this.channelUrl);

            const response = await fetch(this.channelUrl, {
                signal: controller.signal,
                redirect: "follow",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "fa-IR,fa;q=0.9,en;q=0.8"
                }
            });

            if (!response.ok) {
                throw new Error("Telegram HTTP " + response.status);
            }

            const html = await response.text();
            const messages = [
                ...html.matchAll(
                    /<div class="tgme_widget_message_text[^>]*>([\s\S]*?)<\/div>/g
                )
            ];
            const timestamps = [
                ...html.matchAll(/<time\b[^>]*datetime=["']([^"']+)["'][^>]*>/gi)
            ];

            if (messages.length === 0) {
                throw new Error("Telegram message not found");
            }

            for (let i = messages.length - 1; i >= 0; i--) {
                const body = this.cleanHtmlMessage(messages[i][1]);
                if (!body) continue;

                // Telegram renders message timestamps outside the text div.
                // Carry that trusted server timestamp into the parser input.
                const timestamp = timestamps[i]?.[1];
                const message = timestamp
                    ? body + "\nTelegram timestamp: " + timestamp
                    : body;

                try {
                    TelegramPriceParser.parse(message);
                    console.log("VALID TELEGRAM PRICE MESSAGE FOUND", this.channelUrl);
                    return message;
                } catch {
                    // Do not silently walk back to an older price when the
                    // newest gold-price post has dropped its currency line.
                    // Throwing lets CompositeMarketPriceProvider try the fallback source.
                    if (
                        this.looksLikeGoldPriceMessage(body) &&
                        !this.hasCurrencyPrice(body)
                    ) {
                        throw new Error(
                            "Latest Telegram gold-price message has no dollar/tether price"
                        );
                    }
                }
            }

            throw new Error("No valid Telegram price message found");
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                throw new Error("Telegram source timeout");
            }
            throw error;
        } finally {
            clearTimeout(timeout);
        }
    }

    private looksLikeGoldPriceMessage(message: string): boolean {
        return /طلای\s*[0-9۰-۹٠-٩]{1,2}\s*عیار/i.test(message);
    }

    private hasCurrencyPrice(message: string): boolean {
        return /(?:دلار(?:\s*تهران)?|تتر)\s*[:：]/i.test(message);
    }

    private cleanHtmlMessage(html: string): string {
        return html
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<[^>]+>/g, "")
            .replace(/&nbsp;/gi, " ")
            .replace(/&amp;/gi, "&")
            .replace(/&quot;/gi, '"')
            .replace(/&#39;|&#x27;/gi, "'")
            .trim();
    }
}
