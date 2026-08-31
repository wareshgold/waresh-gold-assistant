import { faNumber, formatGrouped } from "../../../shared/utils/number";

/**
 * Single authority for numeric rendering in Telegram outputs.
 *
 * Display text (money, weight, percent) uses Persian digits with
 * ٬ / ٫ separators. Values wrapped in <code> stay in Latin digits
 * with "," separator so users can copy them into calculators.
 */
export class TelegramNumberFormatter {
    format(value: number, maximumFractionDigits = 0): string {
        return faNumber(value, maximumFractionDigits);
    }

    formatCode(value: number): string {
        return `<code>${formatGrouped(Math.round(value))}</code>`;
    }

    copyValue(value: number): string {
        return String(Math.round(value));
    }

    money(value: number): string {
        return `${this.format(value)} تومان`;
    }

    compactMoney(value: number): string {
        return `${this.format(value)} تومان`;
    }

    weight(value: number): string {
        return `${this.format(value, 3)} گرم`;
    }

    percent(value: number): string {
        return `${this.format(value, 2)}٪`;
    }
}
