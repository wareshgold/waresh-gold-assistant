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
        const normalized = value.trim().toLowerCase().replace(/\s+/g, " ");

        const exactAliases: Record<string, string> = {
            "🟡 بازار": "menu:market",
            "🟡 بازار طلا": "menu:market",
            "🟡 بازار و قیمت‌ها": "menu:market",
            "🔔 اعلان‌ها": "menu:alerts",
            "🧮 محاسبه": "menu:calculate",
            "🧮 ماشین حساب": "menu:calculate",
            "🧮 ماشین حساب طلا": "menu:calculate",
            "⚙️ تنظیمات": "menu:settings",
            "⚙️ تنظیمات ربات": "settings:bot",
            "📈 استراتژی": "menu:strategy",
            "📈 استراتژی sp2l": "strategy:sp2l",
            "⬅️ بازگشت": "menu:main",
            "🏠 منوی اصلی": "menu:main",
            "🤖 دستیار هوشمند": "/ai",
            "🤖 دستیار ai": "/ai",
            "💰 قیمت لحظه‌ای": "/price",
            "🫧 حباب طلا": "/bubble",
            "📊 تحلیل بازار": "/analytics",
            "📊 منوی بازار": "menu:market"
        };

        if (exactAliases[normalized]) {
            return exactAliases[normalized];
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

        return normalized;
    }
}
