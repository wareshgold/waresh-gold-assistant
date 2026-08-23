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

    private normalizeCommand(value: string): string {
        const normalized = value.trim().toLowerCase();

        const aliases: Record<string, string> = {
            "🟡 بازار طلا": "/price",
            "🧮 ماشین حساب طلا": "/calc",
            "🤖 دستیار هوشمند": "/ai",
            "⚙️ تنظیمات": "/help",
            "📊 تحلیل بازار": "/analytics",
            "🔔 اعلان‌ها": "/alerts",
            "📊 گزارش بازار": "/reports"
        };

        return aliases[normalized] ?? normalized;
    }
}
