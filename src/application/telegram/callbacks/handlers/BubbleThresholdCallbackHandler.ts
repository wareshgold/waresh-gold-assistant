import { TelegramCallbackHandler } from "../TelegramCallbackHandler";
import { TelegramCallbackContext } from "../TelegramCallbackContext";
import { TelegramCommandResponse } from "../../commands/TelegramCommandHandler";
import { BubbleAlertService } from "../../../bubble-alert/BubbleAlertService";
import { TelegramDateTimeFormatter } from "../../presentation/TelegramDateTimeFormatter";

export class BubbleThresholdCallbackHandler implements TelegramCallbackHandler {
    private readonly dateTimeFormatter = new TelegramDateTimeFormatter();

    constructor(private readonly bubbleAlertService: BubbleAlertService) {}

    canHandle(context: TelegramCallbackContext): boolean {
        return context.callback.namespace === "bubble"
            && ["3", "5", "10", "off"].includes(context.callback.action);
    }

    async execute(context: TelegramCallbackContext): Promise<TelegramCommandResponse> {
        const userId = context.userId ?? "";
        const value = context.callback.action;
        const now = this.dateTimeFormatter.format();

        if (value === "off") {
            await this.bubbleAlertService.disable(userId);
            return {
                type: "text",
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
                type: "text",
                content: [
                    "🫧 <b>هشدار حباب طلا فعال شد</b>",
                    "",
                    `آستانه: <b>${threshold}٪</b>`,
                    "",
                    `وقتی حباب طلا بیش از ${threshold}٪ بشه، بهتون اعلان میدیم.`,
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
