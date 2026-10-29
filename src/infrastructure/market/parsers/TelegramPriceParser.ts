import { MarketPrice } from "../../../domain/market/entities/MarketPrice";

export class TelegramPriceParser {
    private static readonly JALALI_MONTHS = [
        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند"
    ];

    static parse(message: string): MarketPrice {
        const normalized = this.normalizeDigits(message);

        const gold18Price =
            this.extractNumber(
                normalized,
                /طلای\s*18\s*عیار\s*[:：]?\s*([\d,]+(?:\.\d+)?)/i
            ) ??
            this.extractNumber(
                normalized,
                /طلای\s*.*?18\s*.*?عیار.*?([\d,]+(?:\.\d+)?)/i
            );

        const currencyPrice =
            this.extractNumber(
                normalized,
                /دلار(?:\s*تهران)?\s*[:：]\s*([\d,]+(?:\.\d+)?)/i
            ) ??
            this.extractNumber(
                normalized,
                /تتر\s*[:：]\s*([\d,]+(?:\.\d+)?)/i
            );

        const ouncePrice =
            this.extractNumber(
                normalized,
                /(?:اونس|انس)\s*(?:طلا|جهانی)?\s*[:：]\s*([\d,]+(?:\.\d+)?)(?:\$)?/i
            ) ??
            this.extractNumber(
                normalized,
                /xau(?:usd)?\s*[:：]\s*([\d,]+(?:\.\d+)?)/i
            );

        if (gold18Price === null || currencyPrice === null) {
            throw new Error("Invalid Telegram price message: gold and currency prices are required");
        }

        return new MarketPrice(
            gold18Price,
            currencyPrice,
            ouncePrice,
            this.extractDateTime(normalized)
        );
    }

    private static extractNumber(text: string, regex: RegExp): number | null {
        const match = text.match(regex);
        if (!match) return null;

        const value = Number(match[1].replace(/,/g, ""));
        return Number.isFinite(value) && value > 0 ? value : null;
    }

    private static extractDateTime(text: string): Date {
        const timeMatch = text.match(/ساعت\s*[:：]\s*(\d{1,2}):(\d{1,2})/);
        const dateMatch = text.match(/تاریخ\s*[:：]\s*(\d{4})\/(\d{1,2})\/(\d{1,2})/);

        if (timeMatch && dateMatch) {
            return this.jalaliDateToUtc(
                Number(dateMatch[1]),
                Number(dateMatch[2]),
                Number(dateMatch[3]),
                Number(timeMatch[1]),
                Number(timeMatch[2])
            );
        }

        // Also supports sources that publish dates like:
        // "🕰️ ۶ آبان ۱۴۰۵ - ۱۸:۰۱"
        const namedDateMatch = text.match(
            /(?:🕰️\s*)?(\d{1,2})\s+(فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند)\s+(\d{4})\s*[-–—]\s*(\d{1,2}):(\d{2})/
        );

        if (namedDateMatch) {
            const month = this.JALALI_MONTHS.indexOf(namedDateMatch[2]) + 1;
            if (month > 0) {
                return this.jalaliDateToUtc(
                    Number(namedDateMatch[3]),
                    month,
                    Number(namedDateMatch[1]),
                    Number(namedDateMatch[4]),
                    Number(namedDateMatch[5])
                );
            }
        }

        return new Date();
    }

    private static jalaliDateToUtc(
        jalaliYear: number,
        jalaliMonth: number,
        jalaliDay: number,
        tehranHour: number,
        minute: number
    ): Date {
        const gregorian = this.jalaliToGregorian(
            jalaliYear,
            jalaliMonth,
            jalaliDay
        );

        // Tehran is UTC+03:30. Date.UTC normalizes negative hours/minutes.
        return new Date(
            Date.UTC(
                gregorian.year,
                gregorian.month - 1,
                gregorian.day,
                tehranHour - 3,
                minute - 30,
                0
            )
        );
    }

    private static jalaliToGregorian(
        jy: number,
        jm: number,
        jd: number
    ): { year: number; month: number; day: number } {
        jy += 1595;

        const days =
            -355668 +
            365 * jy +
            Math.floor(jy / 33) * 8 +
            Math.floor(((jy % 33) + 3) / 4) +
            jd +
            (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);

        let gy = 400 * Math.floor(days / 146097);
        let day = days % 146097;

        if (day > 36524) {
            gy += 100 * Math.floor(--day / 36524);
            day %= 36524;
            if (day >= 365) day++;
        }

        gy += 4 * Math.floor(day / 1461);
        day %= 1461;

        if (day > 365) {
            gy += Math.floor((day - 1) / 365);
            day = (day - 1) % 365;
        }

        const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let monthIndex = 0;

        while (monthIndex < 12 && day >= monthDays[monthIndex]) {
            day -= monthDays[monthIndex];
            monthIndex++;
        }

        return {
            year: gy,
            month: monthIndex + 1,
            day: day + 1
        };
    }

    private static normalizeDigits(value: string): string {
        return value
            .replace(/[۰-۹٠-٩]/g, digit => {
                const persianIndex = "۰۱۲۳۴۵۶۷۸۹".indexOf(digit);
                if (persianIndex >= 0) return String(persianIndex);
                return String("٠١٢٣٤٥٦٧٨٩".indexOf(digit));
            })
            .replace(/[٬،٫]/g, match => match === "٫" ? "." : ",");
    }
}
