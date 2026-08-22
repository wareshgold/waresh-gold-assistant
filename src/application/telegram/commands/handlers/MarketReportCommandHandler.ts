import { TelegramCommandContext } from "../TelegramCommandContext";
import { TelegramCommandHandler } from "../TelegramCommandHandler";
import { MarketReportService } from "../../../market-report/MarketReportService";
import { MarketReportInterval, isMarketReportInterval } from "../../../../domain/market-report/value-objects/MarketReportInterval";

export class MarketReportCommandHandler implements TelegramCommandHandler {
    constructor(private readonly reportService: MarketReportService) {}

    metadata() {
        return {
            command: "/reports",
            description: "تنظیم و دریافت گزارش دوره‌ای بازار طلا",
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

        if (args[0] === "off") {
            await this.reportService.disable(userId);

            return {
                type: "text" as const,
                content: [
                    "🔕 گزارش دوره‌ای بازار غیرفعال شد.",
                    "",
                    "از این پس گزارش خودکار برای شما ارسال نمی‌شود.",
                    "برای فعال‌سازی دوباره، /reports را ارسال کنید.",
                ].join("\n"),
            };
        }

        if (isMarketReportInterval(value)) {
            await this.reportService.configure(
                userId,
                value as MarketReportInterval,
            );

            return {
                type: "text" as const,
                content: [
                    "📊 گزارش دوره‌ای بازار فعال شد.",
                    "",
                    `⏱ فاصله ارسال: هر ${value} ساعت`,
                    "",
                    "در هر گزارش، آخرین وضعیت بازار شامل موارد زیر ارسال می‌شود:",
                    "• قیمت طلای ۱۸ عیار",
                    "• قیمت دلار",
                    "• قیمت اونس جهانی",
                    "• تغییر بازار و روند آن",
                    "• مقدار و درصد حباب طلا",
                ].join("\n"),
            };
        }

        const current = await this.reportService.get(userId);
        const currentText = current?.enabled
            ? `فعال — هر ${current.intervalHours} ساعت`
            : "غیرفعال";

        return {
            type: "text" as const,
            content: [
                "📊 تنظیم گزارش دوره‌ای بازار طلا",
                "━━━━━━━━━━━━━━━━━━",
                "",
                "این قابلیت با فاصله زمانی انتخابی، یک خلاصه تحلیلی از وضعیت بازار را به‌صورت خودکار برای شما ارسال می‌کند.",
                "",
                "محتوای گزارش:",
                "• قیمت طلای ۱۸ عیار",
                "• قیمت دلار و اونس جهانی",
                "• تغییر و روند بازار",
                "• مقدار و درصد حباب طلا",
                "",
                `وضعیت فعلی: ${currentText}`,
                "",
                "فاصله ارسال را انتخاب کنید:",
            ].join("\n"),
            replyMarkup: {
                type: "INLINE",
                rows: [
                    [
                        { text: "⏱ هر ۱ ساعت", actionId: "reports:1h" },
                        { text: "⏱ هر ۶ ساعت", actionId: "reports:6h" },
                    ],
                    [
                        { text: "⏱ هر ۱۲ ساعت", actionId: "reports:12h" },
                    ],
                    [
                        { text: "🔕 غیرفعال کردن", actionId: "reports:off" },
                    ],
                ],
            },
        };
    }
}
