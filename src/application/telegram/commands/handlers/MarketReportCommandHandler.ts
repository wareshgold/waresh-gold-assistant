import { TelegramCommandContext } from "../TelegramCommandContext";
import { TelegramCommandHandler } from "../TelegramCommandHandler";
import { MarketReportService } from "../../../market-report/MarketReportService";
import { MarketReportInterval, isMarketReportInterval } from "../../../../domain/market-report/value-objects/MarketReportInterval";
import { TelegramDateTimeFormatter } from "../../presentation/TelegramDateTimeFormatter";

export class MarketReportCommandHandler implements TelegramCommandHandler {
    private readonly dateTimeFormatter = new TelegramDateTimeFormatter();

    constructor(private readonly reportService: MarketReportService) {}

    metadata() {
        return {
            command: "/reports",
            description: "تنظیم و دریافت گزارش دوره‌ای بازار طلا"
        };
    }

    canHandle(command: string): boolean {
        const normalizedCommand = command.trim().toLowerCase();
        return normalizedCommand === "/reports" || normalizedCommand === "reports";
    }

    async execute(context: TelegramCommandContext) {
        const userId = context.userId ?? "";
        const args = context.arguments;
        const value = Number(args[0]);
        const now = this.dateTimeFormatter.format();

        if (args[0] === "off") {
            await this.reportService.disable(userId);

            return {
                type: "text" as const,
                content: [
                    "🔕 <b>گزارش دوره‌ای خاموش شد</b>",
                    "",
                    `🕐 ${now}`,
                    "",
                    "ارسال خودکار گزارش بازار متوقف شد."
                ].join("\n")
            };
        }

        if (isMarketReportInterval(value)) {
            await this.reportService.configure(
                userId,
                value as MarketReportInterval
            );

            return {
                type: "text" as const,
                content: [
                    "📊 <b>گزارش دوره‌ای فعال شد</b>",
                    "",
                    `⏱ هر ${value} ساعت`,
                    `🕐 ${now}`,
                    "",
                    "گزارش شامل قیمت طلا، دلار، انس، تغییر بازار و حباب خواهد بود."
                ].join("\n")
            };
        }

        const current = await this.reportService.get(userId);
        const currentText = current?.enabled
            ? `فعال • هر ${current.intervalHours} ساعت`
            : "غیرفعال";

        return {
            type: "text" as const,
            content: [
                "📊 <b>تنظیم گزارش دوره‌ای بازار</b>",
                "",
                `وضعیت: <b>${currentText}</b>`,
                `🕐 ${now}`,
                "",
                "محتوای گزارش:",
                "• طلای ۱۸ عیار",
                "• دلار و انس جهانی",
                "• تغییر و روند بازار",
                "• مقدار و درصد حباب",
                "",
                "فاصله ارسال را انتخاب کنید:"
            ].join("\n"),
            replyMarkup: {
                type: "INLINE",
                rows: [
                    [
                        { text: "۱ ساعت", actionId: "reports:1h" },
                        { text: "۶ ساعت", actionId: "reports:6h" },
                        { text: "۱۲ ساعت", actionId: "reports:12h" }
                    ],
                    [
                        { text: "🔕 خاموش کردن", actionId: "reports:off" }
                    ]
                ]
            }
        };
    }
}
