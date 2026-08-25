import { ApplicationResponse } from "../../common/models/ApplicationResponse";
import { TelegramMessageBuilder } from "./TelegramMessageBuilder";
import { TelegramDateFormatter } from "./TelegramDateFormatter";
import { TelegramNumberFormatter } from "./TelegramNumberFormatter";

export class GoldPriceMessageFormatter {
    constructor(
        private readonly builder: TelegramMessageBuilder,
        private readonly dateFormatter: TelegramDateFormatter,
        private readonly numberFormatter: TelegramNumberFormatter
    ) {}

    format(response: ApplicationResponse): string {
        const metadata = response.metadata ?? {};

        return this.builder.build([
            "🟡 <b>قیمت لحظه‌ای بازار</b>",
            "",
            `طلای ۱۸ عیار   ${this.money(metadata.gold18Price)}`,
            `دلار            ${this.money(metadata.currencyPrice)}`,
            `انس جهانی      ${this.ounce(metadata.ouncePrice)}`,
            "",
            `آخرین بروزرسانی: ${this.date(metadata.updatedAt)}`
        ]);
    }

    private money(value: unknown): string {
        return typeof value === "number"
            ? this.numberFormatter.money(value)
            : "-";
    }

    private ounce(value: unknown): string {
        return typeof value === "number"
            ? `${this.numberFormatter.formatCode(value)} دلار`
            : "-";
    }

    private date(value: unknown): string {
        return value
            ? this.dateFormatter.format(new Date(value as string))
            : "-";
    }
}
