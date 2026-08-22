import {
    OunceTick
} from "../../../domain/sp2l/value-objects/OunceTick";

/**
 * Parses ounce-market messages from the supported Telegram sources.
 *
 * Supported formats:
 *
 * Legacy:
 *   🔴 انس طلا 4,492.42 دلار
 *   🔵 انس طلا 4,492.83 دلار
 *
 * OunceMarkets:
 *   🔺 4604.79 1405/05/31 00:24:35
 *   🔻 4604.78 1405/05/31 00:24:36
 */
export class OuncePriceParser {

    static parse(
        message: string,
        timestamp: number = Date.now()
    ): OunceTick {
        const normalized =
            this.normalize(message);

        const legacyMatch =
            normalized.match(
                /انس\s*طلا\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?)/i
            );

        if (legacyMatch) {
            const price =
                this.parsePrice(legacyMatch[1]);

            return {
                price,
                timestamp,
                direction: this.parseLegacyDirection(message),
                rawMessage: message
            };
        }

        const ounceMarketsMatch =
            normalized.match(
                /(?:🔺|🔻)\s*([0-9]+(?:\.[0-9]+)?)\s+(\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2})/
            );

        if (ounceMarketsMatch) {
            const price =
                this.parsePrice(ounceMarketsMatch[1]);

            return {
                price,
                timestamp,
                direction:
                    ounceMarketsMatch[0].includes("🔺")
                        ? "up"
                        : "down",
                rawMessage: message
            };
        }

        throw new Error(
            "Invalid ounce price message"
        );
    }

    static tryParse(
        message: string,
        timestamp: number = Date.now()
    ): OunceTick | null {
        try {
            return this.parse(
                message,
                timestamp
            );
        } catch {
            return null;
        }
    }

    private static parsePrice(
        value: string
    ): number {
        const price =
            Number(
                value.replace(/,/g, "")
            );

        if (
            !Number.isFinite(price) ||
            price <= 0
        ) {
            throw new Error(
                "Invalid ounce price value"
            );
        }

        return price;
    }

    private static parseLegacyDirection(
        message: string
    ): OunceTick["direction"] {
        if (
            message.includes("🔵") ||
            message.includes("🟢")
        ) {
            return "up";
        }

        if (
            message.includes("🔴")
        ) {
            return "down";
        }

        return "unknown";
    }

    private static normalize(
        value: string
    ): string {
        return value
            .replace(
                /[۰-۹]/g,
                digit =>
                    String(
                        "۰۱۲۳۴۵۶۷۸۹".indexOf(
                            digit
                        )
                    )
            )
            .replace(/٬/g, ",")
            .replace(/\s+/g, " ")
            .trim();
    }
}
