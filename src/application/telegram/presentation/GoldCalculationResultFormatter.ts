import { CalculateGoldFormulaOutput } from "../../gold/CalculateGoldFormulaUseCase";
import { TelegramNumberFormatter } from "./TelegramNumberFormatter";

export class GoldCalculationResultFormatter {
    constructor(private readonly formatter: TelegramNumberFormatter) {}

    format(result: CalculateGoldFormulaOutput): string {
        return [
            "🧮 <b>نتیجه محاسبه طلا</b>",
            "",
            `💰 قیمت نهایی  ${this.formatter.money(result.finalPrice)}`,
            "",
            "<b>جزئیات</b>",
            `⚖️ ارزش طلا   ${this.formatter.money(result.goldValue)}`,
            `🛠 اجرت       ${this.formatter.money(result.labor)}`,
            `💹 سود        ${this.formatter.money(result.profit)}`,
            `🧾 مالیات     ${this.formatter.money(result.tax)}`,
            "",
            "🟡 Waresh Gold"
        ].join("\n");
    }
}
