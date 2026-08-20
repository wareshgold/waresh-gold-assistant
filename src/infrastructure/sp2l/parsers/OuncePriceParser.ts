import {
    OunceTick
} from "../../../domain/sp2l/value-objects/OunceTick";

/**
 * Parses ounce ticks from supported Telegram message formats.
 *
 * Examples:
 * 🔴 انس طلا 4,492.42 دلار
 * 🔵 انس طلا 4,492.83 دلار
 * 🔺 4473.49     1405/05/29 16:27:04
 * 🔻 4473.69     1405/05/29 16:27:10
 */
export class OuncePriceParser {

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
            price <= 0
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

        const messageTimestamp =
            this.extractTimestamp(normalized);

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

        const marketMatch =
            normalized.match(
                /(?:🔺|🔻|up|down)?\s*([0-9]{1,5}(?:,[0-9]{3})*(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?)/iu
            );

        if (!marketMatch) {
            return null;
        }

        return Number(
            marketMatch[1].replace(/,/g, "")
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
            month < 1 ||
            month > 12 ||
            day < 1 ||
            day > 31 ||
            hour > 23 ||
            minute > 59 ||
            second > 59
        ) {
            return null;
        }

        // Telegram's source timestamp is Jalali. Convert it to Gregorian
        // without introducing a date-library dependency into the parser.
        const gregorian =
            this.jalaliToGregorian(
                year,
                month,
                day
            );

        if (!gregorian) {
            return null;
        }

        return Date.UTC(
            gregorian.year,
            gregorian.month - 1,
            gregorian.day,
            hour,
            minute,
            second
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
            jd > 31
        ) {
            return null;
        }

        let gy = jy + 621;
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
        leapJ += Math.floor(n / 33) * 8 +
            Math.floor(((n % 33) + 3) / 4);

        if (
            jump % 33 === 4 &&
            jump - n === 4
        ) {
            leapJ += 1;
        }

        leapG =
            Math.floor(gy / 4) -
            Math.floor((Math.floor(gy / 100) + 1) * 3 / 4) -
            150;

        march =
            20 +
            leapJ -
            leapG;

        if (jm <= 6) {
            leap = (jm - 1) * 31 + jd - 1;
        } else {
            leap =
                (jm - 1) * 30 +
                6 +
                jd - 1;
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
            year: gregorianDay.getUTCFullYear(),
            month: gregorianDay.getUTCMonth() + 1,
            day: gregorianDay.getUTCDate()
        };
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
