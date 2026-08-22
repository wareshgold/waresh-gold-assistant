import {
    OuncePriceParser
} from "./parsers/OuncePriceParser";

import {
    OunceTick
} from "../../domain/sp2l/value-objects/OunceTick";

export class TelegramOunceMessageProvider {

    constructor(
        private readonly channelUrl: string =
            "https://t.me/s/OunceMarkets",
        private readonly timeoutMs: number = 5000
    ) {}

    async getLatestRawMessage(): Promise<string> {
        const messages =
            await this.getRawMessages();

        if (messages.length === 0) {
            throw new Error(
                "Ounce telegram message not found"
            );
        }

        return messages[messages.length - 1];
    }

    async getLatestTicks(): Promise<OunceTick[]> {
        const messages =
            await this.getRawMessages();

        const ticks: OunceTick[] = [];
        const seen = new Set<string>();

        for (const message of messages) {
            const tick =
                OuncePriceParser.tryParse(message);

            if (!tick) {
                continue;
            }

            const key = [
                tick.timestamp,
                tick.price,
                tick.direction
            ].join(":");

            if (seen.has(key)) {
                continue;
            }

            seen.add(key);
            ticks.push(tick);
        }

        if (ticks.length === 0) {
            throw new Error(
                "Ounce telegram message not found"
            );
        }

        return ticks.sort(
            (a, b) =>
                a.timestamp - b.timestamp
        );
    }

    async getLatestTick(
        timestamp: number = Date.now()
    ): Promise<OunceTick> {
        const message =
            await this.getLatestRawMessage();

        return OuncePriceParser.parse(
            message,
            timestamp
        );
    }

    private async getRawMessages(): Promise<string[]> {
        const controller =
            new AbortController();

        const timeout =
            setTimeout(
                () => controller.abort(),
                this.timeoutMs
            );

        try {
            const response =
                await fetch(
                    this.channelUrl,
                    {
                        signal: controller.signal,
                        redirect: "follow",
                        headers: {
                            "User-Agent":
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151.0.0.0 Safari/537.36",
                            Accept:
                                "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "Accept-Language":
                                "fa-IR,fa;q=0.9,en;q=0.8"
                        }
                    }
                );

            if (!response.ok) {
                throw new Error(
                    `Ounce telegram HTTP ${response.status}`
                );
            }

            const html =
                await response.text();

            const messages = [
                ...html.matchAll(
                    /<div[^>]*class=["'][^"']*tgme_widget_message_text[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi
                )
            ]
                .map(match =>
                    this.cleanHtmlMessage(match[1])
                )
                .filter(message =>
                    OuncePriceParser.tryParse(message) !== null
                );

            if (messages.length > 0) {
                return messages;
            }

            const fallback =
                this.extractOunceMessagesFromHtml(html);

            if (fallback.length > 0) {
                return fallback;
            }

            throw new Error(
                "Ounce telegram message not found"
            );
        } catch (error) {
            if (
                error instanceof DOMException &&
                error.name === "AbortError"
            ) {
                throw new Error(
                    "Ounce telegram source timeout"
                );
            }

            throw error;
        } finally {
            clearTimeout(timeout);
        }
    }

    private extractOunceMessagesFromHtml(
        html: string
    ): string[] {
        const text =
            this.cleanHtmlMessage(html);

        return text
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean)
            .filter(line =>
                OuncePriceParser.tryParse(line) !== null
            );
    }

    private cleanHtmlMessage(
        html: string
    ): string {
        return html
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p\s*>/gi, "\n")
            .replace(/<[^>]+>/g, "")
            .replace(/&nbsp;/gi, " ")
            .replace(/&amp;/gi, "&")
            .replace(/&quot;/gi, '"')
            .replace(/&#39;/gi, "'")
            .replace(/\r/g, "")
            .trim();
    }
}