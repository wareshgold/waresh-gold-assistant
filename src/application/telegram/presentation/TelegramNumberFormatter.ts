export class TelegramNumberFormatter {
    format(value: number, maximumFractionDigits = 0): string {
        return new Intl.NumberFormat("en-US", {
            maximumFractionDigits,
            minimumFractionDigits: 0
        }).format(value);
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
