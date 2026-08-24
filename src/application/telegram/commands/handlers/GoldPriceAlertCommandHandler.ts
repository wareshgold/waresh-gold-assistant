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

import {
    TelegramDateTimeFormatter
} from "../../presentation/TelegramDateTimeFormatter";

export class GoldPriceAlertCommandHandler implements TelegramCommandHandler {
    private readonly dateTimeFormatter = new TelegramDateTimeFormatter();

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
        const normalized = command.trim().toLowerCase();
        return normalized === "/alerts" || normalized === "alerts";
    }

    async execute(context: TelegramCommandContext) {
        const userId = context.userId ?? "";
        const args = context.arguments;
        const value = Number(args[0]);
        const now = this.dateTimeFormatter.format();
        const actionId = (context.metadata as Record<string, unknown> | undefined)?.actionId as string | undefined;

        // If triggered from "🔔 اعلان قیمت خودکار" menu item, show periodic price config
        if (actionId === "alerts.periodic-price") {
            const current = await this.alertService.get(userId);
            const currentText = current?.enabled
                ? `فعال • هر ${current.intervalHours} ساعت`
                : "غیرفعال";

            return {
                type: "text" as const,
                content: [
                    "🔔 <b>اعلان قیمت خودکار</b>",
                    "",
                    `وضعیت فعلی: <b>${currentText}</b>`,
                    "",
                    "قیمت طلا هر چند ساعت برای شما ارسال شود؟",
                    "",
                    "⚠️ بین ساعت ۱۲ شب تا ۶ صبح اعلان ارسال نمی‌شود."
                ].join("\n"),
                replyMarkup: {
                    type: "INLINE",
                    rows: [
                        [
                            { text: "۱ ساعت", actionId: "alerts:1h" },
                            { text: "۶ ساعت", actionId: "alerts:6h" },
                            { text: "۱۲ ساعت", actionId: "alerts:12h" }
                        ],
                        [
                            { text: "🔕 خاموش کردن", actionId: "alerts:off" }
                        ]
                    ]
                }
            };
        }

        // If triggered from "📋 هشدارهای من" menu item, show current alert status
        if (actionId === "alerts.my-alerts") {
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
                        ? `📬 آخرین ارسال: ${current.lastNotifiedAt.toISOString()}`
                        : "📬 هنوز ارسالی نداشته",
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

        if (args[0] === "off") {
            await this.alertService.disable(userId);

            return {
                type: "text" as const,
                content: [
                    "🔕 <b>اعلان قیمت طلا خاموش شد</b>",
                    "",
                    `🕐 ${now}`,
                    "",
                    "ارسال خودکار اعلان برای شما متوقف شد."
                ].join("\n")
            };
        }

        if ([1, 6, 12].includes(value)) {
            await this.alertService.configure(
                userId,
                value as GoldPriceAlertInterval
            );

            return {
                type: "text" as const,
                content: [
                    "🔔 <b>اعلان قیمت فعال شد</b>",
                    "",
                    `⏱ هر ${value} ساعت`,
                    `🕐 ${now}`,
                    "",
                    "از این پس وضعیت قیمت طلا به‌صورت خودکار برای شما ارسال می‌شود."
                ].join("\n")
            };
        }

        const current = await this.alertService.get(userId);
        const currentText = current?.enabled
            ? `فعال • هر ${current.intervalHours} ساعت`
            : "غیرفعال";

        return {
            type: "text" as const,
            content: [
                "🔔 <b>تنظیم اعلان قیمت طلا</b>",
                "",
                `وضعیت: <b>${currentText}</b>`,
                `🕐 ${now}`,
                "",
                "فاصله ارسال را انتخاب کنید:"
            ].join("\n"),
            replyMarkup: {
                type: "INLINE",
                rows: [
                    [
                        { text: "۱ ساعت", actionId: "alerts:1h" },
                        { text: "۶ ساعت", actionId: "alerts:6h" },
                        { text: "۱۲ ساعت", actionId: "alerts:12h" }
                    ],
                    [
                        { text: "🔕 خاموش کردن", actionId: "alerts:off" }
                    ]
                ]
            }
        };
    }
}
