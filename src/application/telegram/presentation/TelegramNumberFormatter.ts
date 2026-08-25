import { formatWithCommas } from "../../../shared/utils/number";

export class TelegramNumberFormatter {
    format(value: number, maximumFractionDigits = 0): string {
        if (maximumFractionDigits > 0) {
            const fixed = value.toFixed(maximumFractionDigits);
            const [intPart, decPart] = fixed.split(".");
            const formatted = formatWithCommas(Number(intPart));
            return `${formatted}.${decPart}`;
        }
        return formatWithCommas(Math.round(value));
    }

    formatCode(value: number): string {
        return `<code>${this.format(value)}</code>`;
    }

    copyValue(value: number): string {
        return String(Math.round(value));
    }

    money(value: number): string {
        return `${this.formatCode(value)} تومان`;
    }

    compactMoney(value: number): string {
        return `${this.formatCode(value)} تومان`;
    }

    weight(value: number): string {
        return `${this.format(value, 3)} گرم`;
    }

    percent(value: number): string {
        return `${this.format(value, 2)}٪`;
    }
}
