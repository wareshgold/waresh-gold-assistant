import { TelegramCallbackHandler } from "../TelegramCallbackHandler";
import { TelegramCallbackContext } from "../TelegramCallbackContext";
import { TelegramCommandResponse } from "../../commands/TelegramCommandHandler";
import { PriceTargetAlertService } from "../../../price-target-alert/PriceTargetAlertService";
import { TelegramNumberFormatter } from "../../presentation/TelegramNumberFormatter";
import { TelegramDateTimeFormatter } from "../../presentation/TelegramDateTimeFormatter";

export class PriceTargetCallbackHandler implements TelegramCallbackHandler {
    private readonly numberFormatter = new TelegramNumberFormatter();
    private readonly dateTimeFormatter = new TelegramDateTimeFormatter();

    constructor(private readonly alertService: PriceTargetAlertService) {}

    canHandle(context: TelegramCallbackContext): boolean {
        const data = context.data;
        return data.startsWith("price-target-");
    }

    async execute(context: TelegramCallbackContext): Promise<TelegramCommandResponse> {
        const userId = context.userId ?? "";
        const data = context.data;
        const now = this.dateTimeFormatter.format();

        // Handle cancel all
        if (data === "price-target-cancel-all") {
            await this.alertService.cancelAll(userId);
            return {
                type: "text",
                content: [
                    "🔕 <b>همه هشدارها لغو شد</b>",
                    "",
                    `🕐 ${now}`
                ].join("\n")
            };
        }

        // Handle specific cancel: price-target-cancel:<id>
        if (data.startsWith("price-target-cancel:")) {
            const alertId = data.split(":")[1];
            await this.alertService.cancel(alertId);
            const alerts = await this.alertService.getActiveByUser(userId);
            return this.showAlertsList(alerts, now);
        }

        // Handle direction selection
        if (data === "price-target-above" || data === "price-target-below") {
            const direction = data === "price-target-above" ? "ABOVE" : "BELOW";
            const dirLabel = direction === "ABOVE" ? "بالاتر از" : "پایین‌تر از";
            return {
                type: "text",
                content: [
                    "🎯 <b>هشدار رسیدن به قیمت</b>",
                    "",
                    `وقتی قیمت طلا ${dirLabel} مبلغی که می‌خواید رسید، بهتون اعلان میدیم.`,
                    "",
                    "💬 قیمت رو به تومان بنویسید:",
                    "مثال: <code>23000000</code>",
                    "",
                    "⚠️ قیمت باید به تومان باشد"
                ].join("\n")
            };
        }

        return {
            type: "text",
            content: "❌ عملیات نامعتبر"
        };
    }

    private showAlertsList(alerts: any[], now: string) {
        if (alerts.length === 0) {
            return {
                type: "text" as const,
                content: [
                    "🎯 <b>هشدار رسیدن به قیمت</b>",
                    "",
                    "❌ هیچ هشدار فعالی ندارید.",
                    "",
                    "وقتی قیمت طلا به مبلغ موردنظرتون رسید، بهتون اعلان میدیم!",
                    "",
                    "🔔 اعلان یک‌بار مصرفه — بعد از اعلان حذف میشه."
                ].join("\n"),
                replyMarkup: {
                    type: "INLINE" as const,
                    rows: [
                        [
                            { text: "⬆️ بالاتر از", actionId: "price-target-above" },
                            { text: "⬇️ پایین‌تر از", actionId: "price-target-below" }
                        ]
                    ]
                }
            };
        }

        const alertList = alerts.map((alert: any, i: number) => {
            const dirLabel = alert.direction === "ABOVE" ? "⬆️ بالاتر از" : "⬇️ پایین‌تر از";
            return `${i + 1}. ${dirLabel} ${this.numberFormatter.money(alert.targetPrice)}`;
        }).join("\n");

        const cancelButtons = alerts.map((alert: any) => ({
            text: `❌ لغو ${this.numberFormatter.money(alert.targetPrice)}`,
            actionId: `price-target-cancel:${alert.id}`
        }));

        return {
            type: "text" as const,
            content: [
                "🎯 <b>هشدارهای رسیدن به قیمت</b>",
                "",
                alertList,
                "",
                "⚠️ هشدارها یک‌بار مصرف هستند."
            ].join("\n"),
            replyMarkup: {
                type: "INLINE" as const,
                rows: [
                    [
                        { text: "⬆️ بالاتر از", actionId: "price-target-above" },
                        { text: "⬇️ پایین‌تر از", actionId: "price-target-below" }
                    ],
                    ...cancelButtons.map(btn => [btn]),
                    [
                        { text: "🔕 لغو همه", actionId: "price-target-cancel-all" }
                    ]
                ]
            }
        };
    }
}
