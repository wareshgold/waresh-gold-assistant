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

    private readonly exactAliases: Record<string, string> = {
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
        "📊 نمودار قیمت": "/analytics",
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

    constructor(handlers: TelegramCommandHandler[]) {
        this.handlers = handlers;
    }

    getHandlers(): TelegramCommandHandler[] {
        return this.handlers;
    }

    async execute(context: TelegramCommandContext): Promise<TelegramExecutorResponse> {
        const command = this.normalizeCommand(context.command);

        const handler = this.handlers.find(
            item => item.canHandle(command)
        );

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

    isExactAlias(text: string): boolean {
        if (text.trim().startsWith("/")) {
            return true;
        }

        const normalized = this.normalizeCommand(text);

        if (this.exactAliases[normalized]) {
            return true;
        }

        const strippedKey = Object.keys(this.exactAliases).find(
            key => key.replace(/[\uFE0E\uFE0F]/g, "") === normalized
        );

        return !!strippedKey;
    }

    private normalizeCommand(value: string): string {
        const normalized =
            KeyboardLayoutNormalizer.normalize(
                value.trim().toLowerCase().replace(/\s+/g, " ")
            ).replace(/[\uFE0E\uFE0F]/g, "");

        if (this.exactAliases[normalized]) {
            return this.exactAliases[normalized];
        }

        const strippedKey = Object.keys(this.exactAliases).find(
            key => key.replace(/[\uFE0E\uFE0F]/g, "") === normalized
        );

        if (strippedKey) {
            return this.exactAliases[strippedKey];
        }

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

        if (!normalized.startsWith("/") && this.isGoldQuestion(normalized)) {
            return "/ai";
        }

        return normalized;
    }

    private isGoldQuestion(text: string): boolean {
        const goldKeywords = [
            "گرم",
            "طلا",
            "انس",
            "مثقال",
            "عیار",
            "اجرت",
            "سود",
            "مالیات",
            "حباب",
            "قیمت",
            "خرید",
            "فروش",
            "سکه",
            "شمش",
            "دلار",
            "FACTOR",
            "gram",
            "gold",
            "ounce"
        ];

        return goldKeywords.some(
            keyword => text.includes(keyword.toLowerCase())
        );
    }
}