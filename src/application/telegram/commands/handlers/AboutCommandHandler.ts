import { TelegramCommandContext } from "../TelegramCommandContext";
import { TelegramCommandHandler } from "../TelegramCommandHandler";
import { TelegramDateTimeFormatter } from "../../presentation/TelegramDateTimeFormatter";

export class AboutCommandHandler implements TelegramCommandHandler {
    private readonly dateTimeFormatter = new TelegramDateTimeFormatter();

    metadata() {
        return {
            command: "/about",
            description: "درباره وارش گلد",
        };
    }

    canHandle(command: string): boolean {
        const normalized = command.trim().toLowerCase();
        return normalized === "/about" || normalized === "about";
    }

    async execute(_context: TelegramCommandContext) {
        const now = this.dateTimeFormatter.format();

        const content = [
            "ℹ️ <b>درباره وارش گلد</b>",
            "",
            "🟡 <b>وارش گلد</b> — دستیار هوشمند طلا و جواهر",
            "",
            "💰 قیمت لحظه‌ای طلا و ارز",
            "📊 تحلیل بازار و روند",
            "🧮 محاسبه دقیق خرید و فروش",
            "🫧 بررسی حباب طلا",
            "🔔 اعلان قیمت و هشدار",
            "🤖 دستیار هوشمند هوش مصنوعی",
            "⭐ سیگنال استراتژی A (VIP)",
            "",
            "bot: @wareshgold_bot",
            "web: wareshgold.ir",
            "",
            `🕐 ${now}`
        ].join("\n");

        return {
            type: "text" as const,
            content,
        };
    }
}
