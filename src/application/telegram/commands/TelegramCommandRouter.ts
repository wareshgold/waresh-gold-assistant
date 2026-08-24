import {
    TelegramCommandContext
} from "./TelegramCommandContext";

import {
    TelegramCommandHandler
} from "./TelegramCommandHandler";

import {
    TelegramExecutorResponse
} from "../interfaces/TelegramCommandExecutor";

import {
    KeyboardLayoutNormalizer
} from "../../ai/guards/KeyboardLayoutNormalizer";

export class TelegramCommandRouter {
    private readonly handlers: TelegramCommandHandler[];

    constructor(handlers: TelegramCommandHandler[]) {
        this.handlers = handlers;
    }

    getHandlers(): TelegramCommandHandler[] {
        return this.handlers;
    }

    async execute(context: TelegramCommandContext): Promise<TelegramExecutorResponse> {
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
        const normalized =
            KeyboardLayoutNormalizer.normalize(
                value.trim().toLowerCase().replace(/\s+/g, " ")
            ).replace(/[\uFE0E\uFE0F]/g, "");

        const exactAliases: Record<string, string> = {
            "🟡 بازار": "menu:market",
            "🟡 بازار طلا": "menu:market",
            "🟡 بازار و قیمت‌ها": "menu:market",
            "🔔 اعلان‌ها": "menu:alerts",
            "🧮 محاسبه": "menu:calculate",
            "🧮 ماشین حساب": "menu:calculate",
            "🧮 ماشین حساب طلا": "menu:calculate",
            "🧮 محاسبه قیمت طلا": "/calc",
            "⚙️ تنظیمات": "menu:settings",
            "⬅️ بازگشت": "menu:main",
            "🏠 منوی اصلی": "menu:main",
            "🤖 دستیار هوشمند": "/ai",
            "🤖 دستیار ai": "/ai",
            "💰 قیمت لحظه‌ای": "/price",
            "🫧 حباب طلا": "/bubble",
            "📈 تحلیل بازار": "/analytics",
            "📊 تحلیل بازار": "/analytics",
            "📊 نمودار قیمت": "/chart",
            "🔔 اعلان قیمت خودکار": "/alerts",
            "🫧 هشدار حباب طلا": "/bubble-alert",
            "🧾 محاسبه فاکتور": "/invoice",
            "📐 حل فرمول": "/formula",
            "📐 حل فرمول طلا": "/formula",
            "📈 استراتژی": "menu:strategy",
            "📌 قیمت لحظه‌ای": "/price",
            "📊 تحلیل و تغییرات بازار": "/analytics",
            "🎯 هشدار رسیدن به قیمت": "/alerts",
            "📋 هشدارهای من": "/my-alerts",
            "📊 سیگنال استراتژی a": "/strategy-a",
            "📜 تاریخچه قیمت": "/history",
            "📜 تاریخچه محاسبات": "/calc-history",
            "🔄 محاسبه معکوس طلا": "/reverse-labor",
            "ℹ درباره ربات": "/about",
            "درباره ربات": "/about",
            "درباره": "/about"
        };

        if (exactAliases[normalized]) {
            return exactAliases[normalized];
        }

        // Debug: log unmatched commands for diagnosis
        console.log("ROUTER_UNMATCHED", { raw: value, normalized, keys: Object.keys(exactAliases).filter(k => k.includes("ربات") || k.includes("about") || k.includes("درباره")) });

        if (!normalized.startsWith("/") && normalized.includes("بازار")) {
            return "menu:market";
        }

        if (!normalized.startsWith("/") && normalized.includes("اعلان")) {
            return "menu:alerts";
        }

        if (!normalized.startsWith("/") && normalized.includes("دستیار")) {
            return "/ai";
        }

        if (!normalized.startsWith("/") && normalized.includes("استراتژی")) {
            return "menu:strategy";
        }

        if (!normalized.startsWith("/") && normalized.includes("هشدار")) {
            return "menu:alerts";
        }

        if (!normalized.startsWith("/") && normalized.includes("محاسبه معکوس")) {
            return "/reverse-labor";
        }

        // If it looks like a gold-related question, route to AI
        if (!normalized.startsWith("/") && this.isGoldQuestion(normalized)) {
            return "/ai";
        }

        return normalized;
    }

    private isGoldQuestion(text: string): boolean {
        const goldKeywords = [
            "گرم", "طلا", "انس", "مثقال", "عیار",
            "اجرت", "سود", "مالیات", "حباب", "قیمت",
            "خرید", "فروش", "سکه", "شمش", "دلار",
            "FACTOR", "gram", "gold", "ounce"
        ];
        return goldKeywords.some(keyword =>
            text.includes(keyword.toLowerCase())
        );
    }
}
