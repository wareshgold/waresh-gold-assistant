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
            "🏠 منوی اصلی": "menu:main"
        };

        if (exactAliases[normalized]) {
            return exactAliases[normalized];
        }

        if (
            normalized.includes("بازار") &&
            !normalized.includes("تحلیل") &&
            !normalized.includes("گزارش") &&
            !normalized.startsWith("/")
        ) {
            return "menu:market";
        }

        if (
            (normalized.includes("محاسبه") ||
                normalized.includes("ماشین حساب")) &&
            !normalized.startsWith("/")
        ) {
            return "menu:calculate";
        }

        if (
            normalized.includes("تنظیمات") &&
            !normalized.startsWith("/")
        ) {
            return "menu:settings";
        }

        if (
            normalized.includes("دستیار") &&
            !normalized.startsWith("/")
        ) {
            return "/ai";
        }

        if (
            (normalized.includes("اعلان") ||
                normalized.includes("alerts")) &&
            !normalized.startsWith("/")
        ) {
            return "/alerts";
        }

        return normalized;
    }
}