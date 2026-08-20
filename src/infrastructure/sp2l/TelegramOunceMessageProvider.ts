import {
    OuncePriceParser
} from "./parsers/OuncePriceParser";

export class TelegramOunceMessageProvider {

    constructor(
        private readonly channelUrl: string =
            "https://t.me/s/gheymatOunce",
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
                                "Mozilla/5.0",
                            Accept:
                                "text/html"
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
                    /<div class="tgme_widget_message_text[^>]*>([\s\S]*?)<\/div>/g
                )
            ];

            if (messages.length === 0) {
                throw new Error(
                    "Ounce telegram message not found"
                );
            }

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

            throw new Error(
                "No valid ounce price message found"
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

    private cleanHtmlMessage(
        html: string
    ): string {
        return html
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<[^>]+>/g, "")
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&")
            .trim();
    }
}