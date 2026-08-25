import { TelegramCommandContext } from "../TelegramCommandContext";
import { TelegramCommandHandler } from "../TelegramCommandHandler";

interface HelpCommandDefinition {
    command: string;
    description: string;
}

export class HelpCommandHandler implements TelegramCommandHandler {
    constructor(
        private readonly handlerProvider: () => TelegramCommandHandler[],
    ) {}

    metadata() {
        return {
            command: "/help",
            description: "راهنمای کامل امکانات و دستورات وارش گلد",
        };
    }

    canHandle(command: string): boolean {
        const normalizedCommand = command.trim().toLowerCase();
        return normalizedCommand === "/help" || normalizedCommand === "help";
    }

    async execute(_context: TelegramCommandContext) {
        const content = [
            "🟡 <b>وارش گلد</b> — راهنما",
            "━━━━━━━━━━━━━━━━━━",
            "",
            "💰 <b>بازار و قیمت</b>",
            `<code>/price</code> — قیمت لحظه‌ای طلا`,
            `<code>/bubble</code> — حباب طلا`,
            `<code>/analytics</code> — تحلیل بازار`,
            `<code>/history</code> — تاریخچه قیمت`,
            "",
            "🧮 <b>محاسبات طلا</b>",
            `<code>/calc</code> — محاسبه قیمت طلا`,
            `<code>/reverse-labor</code> — محاسبه معکوس اجرت`,
            `<code>/calc-history</code> — تاریخچه محاسبات`,
            "",
            "🔔 <b>اعلان‌ها</b>",
            `<code>/alerts</code> — تنظیم اعلان قیمت`,
            "",
            "🤖 <b>دستیار هوشمند</b>",
            `<code>/ai</code> — گفتگو با دستیار هوشمند`,
            "",
            "⭐ <b>VIP</b>",
            `<code>/vip</code> — فعال‌سازی دسترسی VIP`,
            `<code>/strategy-a</code> — سیگنال استراتژی A`,
            "",
            "⚙️ <b>عمومی</b>",
            `<code>/start</code> — شروع مجدد`,
            `<code>/exit</code> — خروج از گفتگو`,
            "",
            "💡 <i>برای شروع: /price یا /calc</i>",
        ];

        return {
            type: "text" as const,
            content: content.join("\n"),
        };
    }
}
