import { TelegramCommandContext } from "../TelegramCommandContext";
import { TelegramCommandHandler } from "../TelegramCommandHandler";
import { BubbleAlertService } from "../../../bubble-alert/BubbleAlertService";
import { TelegramDateTimeFormatter } from "../../presentation/TelegramDateTimeFormatter";

export class BubbleAlertCommandHandler implements TelegramCommandHandler {
    private readonly dateTimeFormatter = new TelegramDateTimeFormatter();

    constructor(private readonly bubbleAlertService: BubbleAlertService) {}

    metadata() {
        return {
            command: "/bubble-alert",
            description: "تنظیم هشدار حباب طلا"
        };
    }

    canHandle(command: string): boolean {
        const normalized = command.trim().toLowerCase();
        return normalized === "/bubble-alert" || normalized === "bubble-alert";
    }

    async execute(context: TelegramCommandContext) {
        const userId = context.userId ?? "";
        const args = context.arguments;
        const now = this.dateTimeFormatter.format();
        const actionId = (context.metadata as Record<string, unknown> | undefined)?.actionId as string | undefined;

        // If triggered from "🔔 اعلان حباب طلا" menu item, show config
        if (actionId === "alerts.bubble") {
            const current = await this.bubbleAlertService.get(userId);
            const currentText = current?.enabled
                ? `فعال • آستانه ${current.thresholdPercent}%`
                : "غیرفعال";

            return {
                type: "text" as const,
                content: [
                    "🫧 <b>هشدار حباب طلا</b>",
                    "",
                    `وضعیت فعلی: <b>${currentText}</b>`,
                    "",
                    "وقتی حباب طلا از آستانه تعیین‌شده رد بشه، بهتون اعلان میدیم.",
                    "",
                    "⚠️ بین ساعت ۱۲ شب تا ۶ صبح اعلان ارسال نمی‌شود."
                ].join("\n"),
                replyMarkup: {
                    type: "INLINE",
                    rows: [
                        [
                            { text: "۳٪", actionId: "bubble:3" },
                            { text: "۵٪", actionId: "bubble:5" },
                            { text: "۱۰٪", actionId: "bubble:10" }
                        ],
                        [
                            { text: "🔕 خاموش کردن", actionId: "bubble:off" }
                        ]
                    ]
                }
            };
        }

        // Handle threshold selection
        if (actionId?.startsWith("bubble:")) {
            const value = actionId.split(":")[1];

            if (value === "off") {
                await this.bubbleAlertService.disable(userId);
                return {
                    type: "text" as const,
                    content: [
                        "🔕 <b>هشدار حباب طلا خاموش شد</b>",
                        "",
                        `🕐 ${now}`
                    ].join("\n")
                };
            }

            const threshold = Number(value);
            if ([3, 5, 10].includes(threshold)) {
                await this.bubbleAlertService.configure(userId, threshold);
                return {
                    type: "text" as const,
                    content: [
                        "🫧 <b>هشدار حباب طلا فعال شد</b>",
                        "",
                        `📊 آستانه: ${threshold}%`,
                        `🕐 ${now}`,
                        "",
                        "وقتی حباب طلا بیشتر از این مقدار بشه، بهتون اعلان میدیم."
                    ].join("\n")
                };
            }
        }

        // Default: show settings
        const current = await this.bubbleAlertService.get(userId);
        const currentText = current?.enabled
            ? `فعال • آستانه ${current.thresholdPercent}%`
            : "غیرفعال";

        return {
            type: "text" as const,
            content: [
                "🫧 <b>تنظیم هشدار حباب طلا</b>",
                "",
                `وضعیت: <b>${currentText}</b>`,
                `🕐 ${now}`,
                "",
                "آستانه هشدار را انتخاب کنید:"
            ].join("\n"),
            replyMarkup: {
                type: "INLINE",
                rows: [
                    [
                        { text: "۳٪", actionId: "bubble:3" },
                        { text: "۵٪", actionId: "bubble:5" },
                        { text: "۱۰٪", actionId: "bubble:10" }
                    ],
                    [
                        { text: "🔕 خاموش کردن", actionId: "bubble:off" }
                    ]
                ]
            }
        };
    }
}
