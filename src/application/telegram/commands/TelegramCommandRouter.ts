import {
    TelegramCommandContext
} from "./TelegramCommandContext";

import {
    TelegramCommandHandler
} from "./TelegramCommandHandler";

import {
    TelegramExecutorResponse
} from "../interfaces/TelegramCommandExecutor";

export class TelegramCommandRouter {
    private readonly handlers: TelegramCommandHandler[];

    constructor(handlers: TelegramCommandHandler[]) {
        this.handlers = handlers;
    }

    getHandlers(): TelegramCommandHandler[] {
        return this.handlers;
    }

    async execute(
        context: TelegramCommandContext
    ): Promise<TelegramExecutorResponse> {
        const command = this.normalizeCommand(context.command);

        const handler = this.handlers.find(item => item.canHandle(command));

        if (!handler) {
            return {
                type: "text",
                content: "دستور نامعتبر است"
            };
        }

        return handler.execute({
            ...context,
            command
        });
    }

    resolveCommand(value: string): string {
        return this.normalizeCommand(value);
    }

    private normalizeCommand(value: string): string {
        const normalized = value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");

        const exactAliases: Record<string, string> = {
            "🟡 بازار": "menu:market",
            "🧮 محاسبه": "menu:calculate",
            "🤖 دستیار ai": "/ai",
            "🔔 اعلان‌ها": "/alerts",
            "⚙️ تنظیمات": "menu:settings",
            "🟡 بازار طلا": "menu:market",
            "🧮 ماشین حساب": "menu:calculate",
            "🧮 ماشین حساب طلا": "menu:calculate",
            "🤖 دستیار هوشمند": "/ai",
            "📊 تحلیل بازار": "/analytics",
            "📊 گزارش بازار": "/reports",
            "⬅️ بازگشت": "menu:main",
            "🏠 منوی اصلی": "menu:main",

            "💰 قیمت لحظه‌ای": "/price",
            "🫧 حباب طلا": "/bubble",
            "📊 نمودار قیمت": "/chart",
            "📜 تاریخچه قیمت": "/history",
            "📈 تحلیل بازار": "/analytics",

            "🧮 محاسبه قیمت طلا": "/calc",
            "🧾 محاسبه فاکتور": "/invoice",
            "🔄 محاسبه معکوس طلا": "/reverse-labor",
            "📐 حل فرمول طلا": "/formula",
            "📜 تاریخچه محاسبات": "/calc-history",

            "🔔 تنظیم اعلان‌ها": "/alerts",
            "👤 حساب کاربری": "/help",
            "⚙️ تنظیمات ربات": "/help",

            "📚 آموزش و اطلاعات طلا": "/help",
            "❓ راهنما": "/help"
        };

        if (exactAliases[normalized]) {
            return exactAliases[normalized];
        }

        if (
            !normalized.startsWith("/") &&
            normalized.includes("بازار") &&
            !normalized.includes("تحلیل") &&
            !normalized.includes("گزارش") &&
            !normalized.includes("قیمت") &&
            !normalized.includes("حباب") &&
            !normalized.includes("نمودار") &&
            !normalized.includes("تاریخچه")
        ) {
            return "menu:market";
        }

        if (
            !normalized.startsWith("/") &&
            (normalized === "🧮 محاسبه" ||
                normalized === "محاسبه" ||
                normalized === "ماشین حساب" ||
                normalized === "🧮 ماشین حساب")
        ) {
            return "menu:calculate";
        }

        if (
            !normalized.startsWith("/") &&
            (normalized === "⚙️ تنظیمات" ||
                normalized === "تنظیمات")
        ) {
            return "menu:settings";
        }

        if (
            !normalized.startsWith("/") &&
            normalized.includes("دستیار")
        ) {
            return "/ai";
        }

        if (
            !normalized.startsWith("/") &&
            normalized.includes("اعلان")
        ) {
            return "/alerts";
        }

        if (
            !normalized.startsWith("/") &&
            (normalized.includes("بازگشت") ||
                normalized.includes("منوی اصلی"))
        ) {
            return "menu:main";
        }

        return normalized;
    }
}