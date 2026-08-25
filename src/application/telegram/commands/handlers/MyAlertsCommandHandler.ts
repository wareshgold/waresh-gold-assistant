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
    TelegramDateTimeFormatter
} from "../../presentation/TelegramDateTimeFormatter";

export class MyAlertsCommandHandler implements TelegramCommandHandler {
    private readonly dateTimeFormatter = new TelegramDateTimeFormatter();

    constructor(
        private readonly alertService: GoldPriceAlertService
    ) {}

    metadata() {
        return {
            command: "/my-alerts",
            description: "مشاهده وضعیت هشدارهای من"
        };
    }

    canHandle(command: string): boolean {
        const normalized = command.trim().toLowerCase();
        return normalized === "/my-alerts" || normalized === "my-alerts";
    }

    async execute(context: TelegramCommandContext) {
        const userId = context.userId ?? "";
        const now = this.dateTimeFormatter.format();

        const current = await this.alertService.get(userId);

        if (!current || !current.enabled) {
            return {
                type: "text" as const,
                content: [
                    "🔔 <b>هشدارهای من</b>",
                    "",
                    "❌ هیچ اعلان فعالی ندارید.",
                    "",
                    "برای فعالسازی اعلان قیمت طلا از دکمه زیر استفاده کنید:"
                ].join("\n"),
                replyMarkup: {
                    type: "INLINE",
                    rows: [
                        [
                            { text: "🔔 فعالسازی اعلان", actionId: "alerts:price-target" }
                        ]
                    ]
                }
            };
        }

        return {
            type: "text" as const,
            content: [
                "🔔 <b>هشدارهای من</b>",
                "",
                `✅ وضعیت: <b>فعال</b>`,
                `⏱ فاصله ارسال: هر ${current.intervalHours} ساعت`,
                current.lastNotifiedAt
                    ? `📬 آخرین ارسال: ${this.dateTimeFormatter.format(current.lastNotifiedAt)}`
                    : "📬 هنوز ارسالی نداشته",
                "",
                `🕐 ${now}`
            ].join("\n"),
            replyMarkup: {
                type: "INLINE",
                rows: [
                    [
                        { text: "⚙️ تغییر فاصله", actionId: "alerts:price-target" },
                        { text: "🔕 خاموش کردن", actionId: "alerts:off" }
                    ]
                ]
            }
        };
    }
}
