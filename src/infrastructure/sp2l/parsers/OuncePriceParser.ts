import {
    OunceTick
} from "../../../domain/sp2l/value-objects/OunceTick";

/**
 * Parses messages like:
 * 🔴 انس طلا 4,492.42 دلار
 * 🔵 انس طلا 4,492.83 دلار
 */
export class OuncePriceParser {

    static parse(
        message: string,
        timestamp: number = Date.now()
    ): OunceTick {
        const normalized =
            this.normalize(message);

        const match =
            normalized.match(
                /انس\s*طلا\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?)/i
            );

        if (!match) {
            throw new Error(
                "Invalid ounce price message"
            );
        }

        const price =
            Number(
                match[1].replace(/,/g, "")
            );

        if (
            !Number.isFinite(price) ||
            price <= 0
        ) {
            throw new Error(
                "Invalid ounce price value"
            );
        }

        let direction: OunceTick["direction"] =
            "unknown";

        if (
            message.includes("🔵") ||
            message.includes("🟢")
        ) {
            direction = "up";
        } else if (
            message.includes("🔴")
        ) {
            direction = "down";
        }

        return {
            price,
            timestamp,
            direction,
            rawMessage: message
        };
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