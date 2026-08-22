import {
    TelegramCommandContext
} from "../TelegramCommandContext";

import {
    TelegramCommandHandler
} from "../TelegramCommandHandler";

import {
    GoldPriceAlertService
} from "../../../gold-alert/GoldPriceAlertService";

import {
    GoldPriceAlertInterval
} from "../../../../domain/gold-alert/value-objects/GoldPriceAlertInterval";

export class GoldPriceAlertCommandHandler
implements TelegramCommandHandler {
    constructor(
        private readonly alertService: GoldPriceAlertService
    ) {}

    metadata() {
        return {
            command: "/alerts",
            description: "تنظیم اعلان قیمت طلا"
        };
    }

    canHandle(command: string): boolean {
        return command.trim().toLowerCase() === "/alerts" ||
            command.trim().toLowerCase() === "alerts";
    }

    async execute(context: TelegramCommandContext) {
        const userId = context.userId ?? "";
        const args = context.arguments;
        const value = Number(args[0]);

        if (args[0] === "off") {
            await this.alertService.disable(userId);
            return {
                type: "text" as const,
                content: "🔕 اعلان قیمت طلا غیرفعال شد."
            };
        }

        if ([1, 6, 12].includes(value)) {
            await this.alertService.configure(
                userId,
                value as GoldPriceAlertInterval
            );

            return {
                type: "text" as const,
                content:
                    `🔔 اعلان قیمت طلا فعال شد.\n\n⏱ فاصله ارسال: هر ${value} ساعت`
            };
        }

        const current = await this.alertService.get(userId);
        const currentText = current?.enabled
            ? `\n\nوضعیت فعلی: فعال — هر ${current.intervalHours} ساعت`
            : "\n\nوضعیت فعلی: غیرفعال";

        return {
            type: "text" as const,
            content:
                "🔔 تنظیم اعلان قیمت طلا\n\n" +
                "فاصله ارسال را انتخاب کنید:" +
                currentText,
            replyMarkup: {
                type: "INLINE",
                rows: [
                    [
                        { text: "⏱ هر ۱ ساعت", actionId: "alerts:1h" },
                        { text: "⏱ هر ۶ ساعت", actionId: "alerts:6h" }
                    ],
                    [
                        { text: "⏱ هر ۱۲ ساعت", actionId: "alerts:12h" }
                    ],
                    [
                        { text: "🔕 غیرفعال کردن", actionId: "alerts:off" }
                    ]
                ]
            }
        };
    }
}
