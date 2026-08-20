import {
    OuncePriceParser
} from "./parsers/OuncePriceParser";

export class TelegramOunceMessageProvider {

    constructor(
        private readonly channelUrl: string =
            "https://t.me/s/OunceMarkets",
        private readonly timeoutMs: number = 5000
    ) {}

    async getLatestRawMessage(): Promise<string> {
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
            ];

            if (messages.length > 0) {
                for (
                    let i = messages.length - 1;
                    i >= 0;
                    i--
                ) {
                    const message =
                        this.cleanHtmlMessage(
                            messages[i][1]
                        );

                    if (
                        OuncePriceParser.tryParse(
                            message
                        )
                    ) {
                        return message;
                    }
                }
            }

            const fallback =
                this.extractOunceMessageFromHtml(
                    html
                );

            if (fallback) {
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

    async getLatestTick(
        timestamp: number = Date.now()
    ) {
        const message =
            await this.getLatestRawMessage();

        return OuncePriceParser.parse(
            message,
            timestamp
        );
    }

    private extractOunceMessageFromHtml(
        html: string
    ): string | null {
        const text =
            this.cleanHtmlMessage(html);

        const lines =
            text
                .split("\n")
                .map(line => line.trim())
                .filter(Boolean);

        for (let i = lines.length - 1; i >= 0; i--) {
            if (
                OuncePriceParser.tryParse(lines[i])
            ) {
                return lines[i];
            }
        }

        return null;
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
