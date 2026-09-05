import { TelegramCallbackHandler } from "../TelegramCallbackHandler";
import { TelegramCallbackContext } from "../TelegramCallbackContext";
import { TelegramCommandResponse } from "../../commands/TelegramCommandHandler";
import { GoldPriceAlertService } from "../../../gold-alert/GoldPriceAlertService";
import { TelegramDateTimeFormatter } from "../../presentation/TelegramDateTimeFormatter";

export class AlertIntervalCallbackHandler implements TelegramCallbackHandler {
    private readonly dateTimeFormatter = new TelegramDateTimeFormatter();

    constructor(private readonly alertService: GoldPriceAlertService) {}

    canHandle(context: TelegramCallbackContext): boolean {
        return context.callback.namespace === "alerts"
            && ["1h", "6h", "12h", "off", "price-target", "market-analysis", "my-alerts"].includes(context.callback.action);
    }

    async execute(context: TelegramCallbackContext): Promise<TelegramCommandResponse> {
        const userId = context.userId ?? "";
        const value = context.callback.action;
        const now = this.dateTimeFormatter.format();

        if (value === "price-target") {
            const current = await this.alertService.get(userId);
            const currentText = current?.enabled
                ? `فعال • هر ${current.intervalHours} ساعت`
                : "غیرفعال";

            return {
                type: "text",
                content: [
                    "🔔 <b>تنظیم اعلان قیمت طلا</b>",
                    "",
                    `وضعیت فعلی: <b>${currentText}</b>`,
                    "",
                    "فاصله ارسال را انتخاب کنید:",
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

        if (value === "my-alerts") {
            const current = await this.alertService.get(userId);
            const status = current?.enabled
                ? `فعال • هر ${current.intervalHours} ساعت`
                : "غیرفعال";
            const lastSent = current?.lastNotifiedAt
                ? `📬 آخرین ارسال: ${current.lastNotifiedAt}`
                : "📬 آخرین ارسال: ---";

            return {
                type: "text",
                content: [
                    "🔔 <b>هشدارهای من</b>",
                    "",
                    `✅ وضعیت: <b>${status}</b>`,
                    lastSent,
                    "",
                    `🕐 ${now}`
                ].join("\n"),
                replyMarkup: {
                    type: "INLINE",
                    rows: [
                        [
                            { text: "🔔 تنظیم اعلان قیمت", actionId: "alerts:price-target" }
                        ],
                        [
                            { text: "🫧 هشدار حباب", actionId: "alerts:bubble" }
                        ],
                        [
                            { text: "📊 تحلیل بازار", actionId: "analytics" }
                        ]
                    ]
                }
            };
        }

        if (value === "market-analysis") {
            return {
                type: "text",
                content: [
                    "📊 <b>تحلیل بازار</b>",
                    "",
                    "برای دریافت تحلیل بازار از منوی زیر استفاده کنید:"
                ].join("\n"),
                replyMarkup: {
                    type: "INLINE",
                    rows: [
                        [
                            { text: "📊 تحلیل بازار", actionId: "analytics" }
                        ]
                    ]
                }
            };
        }

        if (value === "off") {
            await this.alertService.disable(userId);
            return {
                type: "text",
                content: [
                    "🔕 <b>اعلان قیمت طلا خاموش شد</b>",
                    "",
                    `🕐 ${now}`
                ].join("\n")
            };
        }

        const hours = parseInt(value.replace("h", ""), 10);
        if ([1, 6, 12].includes(hours)) {
            await this.alertService.configure(userId, hours);
            return {
                type: "text",
                content: [
                    "🔔 <b>اعلان قیمت طلا فعال شد</b>",
                    "",
                    `فاصله ارسال: هر <b>${hours} ساعت</b>`,
                    "",
                    "⚠️ بین ساعت ۱۲ شب تا ۶ صبح اعلان ارسال نمی‌شود.",
                    "",
                    `🕐 ${now}`
                ].join("\n")
            };
        }

        return {
            type: "text",
            content: "❌ مقدار نامعتبر"
        };
    }
}
