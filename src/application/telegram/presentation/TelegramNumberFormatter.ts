import { formatWithCommas, formatGrouped } from "../../../shared/utils/number";

/**
 * Single authority for numeric rendering in Telegram outputs.
 * Uses English commas (en-US) for consistent display and copy behavior.
 */
export class TelegramNumberFormatter {
    format(value: number, maximumFractionDigits = 0): string {
        return formatWithCommas(value, maximumFractionDigits);
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
