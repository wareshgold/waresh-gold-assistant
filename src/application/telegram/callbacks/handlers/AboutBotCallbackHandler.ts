import { TelegramCallbackHandler } from "../TelegramCallbackHandler";
import { TelegramCallbackContext } from "../TelegramCallbackContext";
import { TelegramCommandResponse } from "../../commands/TelegramCommandHandler";
import { TelegramDateTimeFormatter } from "../../presentation/TelegramDateTimeFormatter";

export class AboutBotCallbackHandler implements TelegramCallbackHandler {
    private readonly dateTimeFormatter = new TelegramDateTimeFormatter();

    canHandle(context: TelegramCallbackContext): boolean {
        return context.data === "settings:about"
            || context.callback.namespace === "settings" && context.callback.action === "about";
    }

    async execute(_context: TelegramCallbackContext): Promise<TelegramCommandResponse> {
        const now = this.dateTimeFormatter.format();

        return {
            type: "text",
            content: [
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
            ].join("\n")
        };
    }
}
