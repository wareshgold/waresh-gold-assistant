import {
    OunceTick
} from "../../../domain/strategy-a/value-objects/OunceTick";

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

    private static readonly MIN_VALID_OUNCE_PRICE =
        1000;

    private static readonly TEHRAN_OFFSET_MINUTES =
        210;

    static parse(
        message: string,
        timestamp: number = Date.now()
    ): OunceTick {
        const normalized =
            this.normalize(message);

        const price =
            this.extractPrice(normalized);

        if (
            price === null ||
            !Number.isFinite(price) ||
            price < this.MIN_VALID_OUNCE_PRICE
        ) {
            throw new Error(
                "Invalid ounce price message"
            );
        }

        let direction: OunceTick["direction"] =
            "unknown";

        if (
            /(?:🔵|🟢|🔺)/u.test(message)
        ) {
            direction = "up";
        } else if (
            /(?:🔴|🔻)/u.test(message)
        ) {
            direction = "down";
        }

        const hasTimestamp =
            this.hasTimestamp(normalized);

        const messageTimestamp =
            this.extractTimestamp(normalized);

        if (
            hasTimestamp &&
            messageTimestamp === null
        ) {
            throw new Error(
                "Invalid ounce price message timestamp"
            );
        }

        return {
            price,
            timestamp:
                messageTimestamp ?? timestamp,
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

    private static extractPrice(
        normalized: string
    ): number | null {
        const legacyMatch =
            normalized.match(
                /انس\s*طلا\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?)/i
            );

        if (legacyMatch) {
            return Number(
                legacyMatch[1].replace(/,/g, "")
            );
        }

        // OunceMarkets messages always provide the price immediately after
        // the direction marker. Do not allow an arbitrary number elsewhere
        // in the message to be interpreted as the price (for example the
        // Jalali date "1405/05/29"), otherwise a malformed extraction can
        // silently produce prices such as 7 or 1405.
        const marketMatch =
            normalized.match(
                /(?:🔺|🔻|up|down)\s*([0-9]{1,5}(?:,[0-9]{3})*(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?)/iu
            );

        if (!marketMatch) {
            return null;
        }

        return Number(
            marketMatch[1].replace(/,/g, "")
        );
    }

    private static hasTimestamp(
        normalized: string
    ): boolean {
        return /(?:^|\s)\d{4}[\/-]\d{1,2}[\/-]\d{1,2}\s+\d{1,2}:\d{2}:\d{2}(?:\s|$)/.test(
            normalized
        );
    }

    private static extractTimestamp(
        normalized: string
    ): number | null {
        const match =
            normalized.match(
                /(?:^|\s)(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})\s+(\d{1,2}):(\d{2}):(\d{2})(?:\s|$)/
            );

        if (!match) {
            return null;
        }

        const year = Number(match[1]);
        const month = Number(match[2]);
        const day = Number(match[3]);
        const hour = Number(match[4]);
        const minute = Number(match[5]);
        const second = Number(match[6]);

        if (
            year < 1200 ||
            year > 1600 ||
            month < 1 ||
            month > 12 ||
            hour > 23 ||
            minute > 59 ||
            second > 59
        ) {
            return null;
        }

        const maxDay =
            month <= 6
                ? 31
                : 30;

        if (
            day < 1 ||
            day > maxDay
        ) {
            return null;
        }

        // Telegram's OunceMarkets source publishes the timestamp in
        // Tehran local time (UTC+03:30). Convert that wall-clock time to
        // the UTC epoch used by the application.
        const gregorian =
            this.jalaliToGregorian(
                year,
                month,
                day
            );

        if (!gregorian) {
            return null;
        }

        return (
            Date.UTC(
                gregorian.year,
                gregorian.month - 1,
                gregorian.day,
                hour,
                minute,
                second
            ) -
            this.TEHRAN_OFFSET_MINUTES * 60 * 1000
        );
    }

    private static jalaliToGregorian(
        jy: number,
        jm: number,
        jd: number
    ): {
        year: number;
        month: number;
        day: number;
    } | null {
        if (
            jy < 1200 ||
            jy > 1600 ||
            jm < 1 ||
            jm > 12 ||
            jd < 1 ||
            jd > (jm <= 6 ? 31 : 30)
        ) {
            return null;
        }

        const gy = jy + 621;

        const breaks = [
            -61, 9, 38, 199, 426, 686, 756,
            818, 1111, 1181, 1210, 1635, 2060,
            2097, 2192, 2262, 2324, 2394, 2456,
            3178
        ];

        let leapJ = -14;
        let jp = breaks[0];
        let jump = 0;
        let leap = 0;
        let leapG = 0;
        let march = 0;

        for (let i = 1; i < breaks.length; i++) {
            const jmBreak = breaks[i];

            jump = jmBreak - jp;

            if (jy < jmBreak) {
                break;
            }

            leapJ +=
                Math.floor(jump / 33) * 8 +
                Math.floor(
                    (jump % 33) / 4
                );

            jp = jmBreak;
        }

        const n = jy - jp;

        leapJ +=
            Math.floor(n / 33) * 8 +
            Math.floor(
                ((n % 33) + 3) / 4
            );

        if (
            jump % 33 === 4 &&
            jump - n === 4
        ) {
            leapJ += 1;
        }

        leapG =
            Math.floor(gy / 4) -
            Math.floor(
                (Math.floor(gy / 100) + 1) * 3 / 4
            ) -
            150;

        march =
            20 +
            leapJ -
            leapG;

        if (jm <= 6) {
            leap =
                (jm - 1) * 31 +
                jd -
                1;
        } else {
            leap =
                (jm - 1) * 30 +
                6 +
                jd -
                1;
        }

        const gregorianDay =
            new Date(
                Date.UTC(
                    gy,
                    2,
                    march + leap
                )
            );

        return {
            year:
                gregorianDay.getUTCFullYear(),

            month:
                gregorianDay.getUTCMonth() + 1,

            day:
                gregorianDay.getUTCDate()
        };
    }

    private static normalize(
        value: string
    ): string {
        return value
            .replace(
                /[۰-۹٠-٩]/g,
                digit => {
                    const persian =
                        "۰۱۲۳۴۵۶۷۸۹".indexOf(digit);

                    if (persian >= 0) {
                        return String(persian);
                    }

                    return String(
                        "٠١٢٣٤٥٦٧٨٩".indexOf(digit)
                    );
                }
            )
            .replace(/٬/g, ",")
            .replace(/\s+/g, " ")
            .trim();
    }
}
