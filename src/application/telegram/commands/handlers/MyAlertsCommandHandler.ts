import { TelegramCommandContext } from "../TelegramCommandContext";
import { TelegramCommandHandler } from "../TelegramCommandHandler";
import { GoldPriceAlertService } from "../../../gold-alert/GoldPriceAlertService";
import { BubbleAlertService } from "../../../bubble-alert/BubbleAlertService";
import { MarketReportService } from "../../../market-report/MarketReportService";
import { PriceTargetAlertService } from "../../../price-target-alert/PriceTargetAlertService";
import { TelegramDateTimeFormatter } from "../../presentation/TelegramDateTimeFormatter";

export class MyAlertsCommandHandler implements TelegramCommandHandler {
    private readonly dateTimeFormatter = new TelegramDateTimeFormatter();

    constructor(
        private readonly alertService: GoldPriceAlertService,
        private readonly bubbleAlertService?: BubbleAlertService,
        private readonly marketReportService?: MarketReportService,
        private readonly priceTargetAlertService?: PriceTargetAlertService
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

        // Get all alert statuses
        const alerts: string[] = [];

        // 1. Gold Price Alert
        const priceAlert = await this.alertService.get(userId);
        if (priceAlert && priceAlert.enabled) {
            alerts.push(
                `✅ <b>اعلان قیمت طلا</b>\n` +
                `   ⏱ فاصله: هر ${priceAlert.intervalHours} ساعت\n` +
                (priceAlert.lastNotifiedAt
                    ? `   📬 آخرین ارسال: ${this.dateTimeFormatter.format(priceAlert.lastNotifiedAt)}`
                    : `   📬 هنوز ارسالی نداشته`)
            );
        } else {
            alerts.push(`❌ <b>اعلان قیمت طلا</b> — غیرفعال`);
        }

        // 2. Bubble Alert
        if (this.bubbleAlertService) {
            try {
                const bubbleAlert = await this.bubbleAlertService.get(userId);
                if (bubbleAlert && bubbleAlert.enabled) {
                    alerts.push(
                        `✅ <b>هشدار حباب طلا</b>\n` +
                        `   📊 آستانه: ${bubbleAlert.thresholdPercent}%\n` +
                        (bubbleAlert.lastNotifiedAt
                            ? `   📬 آخرین ارسال: ${this.dateTimeFormatter.format(bubbleAlert.lastNotifiedAt)}`
                            : `   📬 هنوز ارسالی نداشته`)
                    );
                } else {
                    alerts.push(`❌ <b>هشدار حباب طلا</b> — غیرفعال`);
                }
            } catch {
                alerts.push(`❌ <b>هشدار حباب طلا</b> — غیرفعال`);
            }
        }

        // 3. Market Report
        if (this.marketReportService) {
            try {
                const reportPrefs = await this.marketReportService.get(userId);
                if (reportPrefs && reportPrefs.enabled) {
                    alerts.push(
                        `✅ <b>گزارش بازار</b>\n` +
                        `   ⏱ فاصله: هر ${reportPrefs.intervalHours} ساعت\n` +
                        (reportPrefs.lastReportedAt
                            ? `   📬 آخرین ارسال: ${this.dateTimeFormatter.format(reportPrefs.lastReportedAt)}`
                            : `   📬 هنوز ارسالی نداشته`)
                    );
                } else {
                    alerts.push(`❌ <b>گزارش بازار</b> — غیرفعال`);
                }
            } catch {
                alerts.push(`❌ <b>گزارش بازار</b> — غیرفعال`);
            }
        }

        // 4. Price Target Alerts
        if (this.priceTargetAlertService) {
            try {
                const priceTargets = await this.priceTargetAlertService.getActiveByUser(userId);
                if (priceTargets.length > 0) {
                    const targetList = priceTargets.map((t, i) => {
                        const dir = t.direction === "ABOVE" ? "⬆️ بالاتر از" : "⬇️ پایین‌تر از";
                        return `   ${i + 1}. ${dir} ${t.targetPrice.toLocaleString("en-US")} تومان`;
                    }).join("\n");
                    alerts.push(
                        `✅ <b>هشدار قیمت هدف</b>\n` +
                        targetList
                    );
                } else {
                    alerts.push(`❌ <b>هشدار قیمت هدف</b> — غیرفعال`);
                }
            } catch {
                alerts.push(`❌ <b>هشدار قیمت هدف</b> — غیرفعال`);
            }
        }

        const activeCount = alerts.filter(a => a.startsWith("✅")).length;
        const totalCount = alerts.length;

        return {
            type: "text" as const,
            content: [
                `🔔 <b>هشدارهای من</b>`,
                ``,
                `📊 وضعیت: ${activeCount}/${totalCount} فعال`,
                ``,
                alerts.join("\n\n"),
                ``,
                `🕐 ${now}`
            ].join("\n"),
            replyMarkup: {
                type: "INLINE",
                rows: [
                    [
                        { text: "🔔 تنظیم اعلان قیمت", actionId: "alerts:periodic-price" },
                        { text: "🫧 هشدار حباب", actionId: "alerts:bubble" }
                    ],
                    [
                        { text: "📊 گزارش بازار", actionId: "alerts:reports" },
                        { text: "🎯 هشدار قیمت هدف", actionId: "alerts:price-target" }
                    ]
                ]
            }
        };
    }
}
