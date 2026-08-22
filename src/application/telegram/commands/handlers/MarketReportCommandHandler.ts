import { TelegramCommandContext } from "../TelegramCommandContext";
import { TelegramCommandHandler } from "../TelegramCommandHandler";
import { MarketReportService } from "../../../market-report/MarketReportService";
import { MarketReportInterval, isMarketReportInterval } from "../../../../domain/market-report/value-objects/MarketReportInterval";

export class MarketReportCommandHandler implements TelegramCommandHandler {
    constructor(private readonly reportService: MarketReportService) {}

    metadata() {
        return {
            command: "/reports",
            description: "تنظیم گزارش دوره‌ای بازار"
        };
    }

    canHandle(command: string): boolean {
        return command.trim().toLowerCase() === "/reports" ||
            command.trim().toLowerCase() === "reports";
    }

    async execute(context: TelegramCommandContext) {
        const userId = context.userId ?? "";
        const args = context.arguments;
        const value = Number(args[0]);

        if (args[0] === "off") {
            await this.reportService.disable(userId);
            return {
                type: "text" as const,
                content: "🔕 گزارش دوره‌ای بازار غیرفعال شد."
            };
        }

        if (isMarketReportInterval(value)) {
            await this.reportService.configure(
                userId,
                value as MarketReportInterval
            );
            return {
                type: "text" as const,
                content: `📊 گزارش بازار فعال شد.\n\n⏱ فاصله ارسال: هر ${value} ساعت`
            };
        }

        const current = await this.reportService.get(userId);
        const currentText = current?.enabled
            ? `\n\nوضعیت فعلی: فعال — هر ${current.intervalHours} ساعت`
            : "\n\nوضعیت فعلی: غیرفعال";

        return {
            type: "text" as const,
            content:
                "📊 تنظیم گزارش دوره‌ای بازار\n\n" +
                "فاصله ارسال را انتخاب کنید:" +
                currentText,
            replyMarkup: {
                type: "INLINE",
                rows: [
                    [
                        { text: "⏱ هر ۱ ساعت", actionId: "reports:1h" },
                        { text: "⏱ هر ۶ ساعت", actionId: "reports:6h" }
                    ],
                    [
                        { text: "⏱ هر ۱۲ ساعت", actionId: "reports:12h" }
                    ],
                    [
                        { text: "🔕 غیرفعال کردن", actionId: "reports:off" }
                    ]
                ]
            }
        };
    }
}
