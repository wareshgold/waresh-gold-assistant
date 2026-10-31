import {
    TelegramConversationFlow
} from "./TelegramConversationFlow";

import {
    TelegramSessionStore
} from "../state/TelegramSessionStore";

import {
    PriceTargetAlertService
} from "../../price-target-alert/PriceTargetAlertService";

import {
    TelegramNumberFormatter
} from "../presentation/TelegramNumberFormatter";

import {
    TelegramDateTimeFormatter
} from "../presentation/TelegramDateTimeFormatter";


interface PriceTargetSessionData {
    direction: "ABOVE" | "BELOW";
}


export class PriceTargetConversationFlow
    implements TelegramConversationFlow {

    private readonly numberFormatter = new TelegramNumberFormatter();
    private readonly dateTimeFormatter = new TelegramDateTimeFormatter();

    constructor(
        private readonly sessionStore: TelegramSessionStore,
        private readonly alertService: PriceTargetAlertService
    ) {}

    canHandle(state: string): boolean {
        return state === "price-target-awaiting-input";
    }

    async execute(
        userId: string,
        message: string
    ): Promise<{
        type: "text";
        content: string;
        metadata?: Record<string, unknown>;
    }> {
        const session =
            await this.sessionStore.get<PriceTargetSessionData>(userId);

        if (!session) {
            return {
                type: "text",
                content: "❌ جلسه هشدار قیمت پیدا نشد. دوباره از منو شروع کنید."
            };
        }

        const direction = session.data.direction;
        const now = this.dateTimeFormatter.format();

        // Handle cancel
        const normalized = message.trim().toLowerCase();
        if (
            normalized === "cancel" ||
            normalized === "لغو" ||
            normalized === "/cancel" ||
            normalized === "/exit"
        ) {
            await this.sessionStore.delete(userId);
            return {
                type: "text",
                content: "❌ ثبت هشدار لغو شد."
            };
        }

        // Parse the price input
        const targetPrice = Number(message.replace(/[,،\s]/g, ""));

        if (isNaN(targetPrice) || targetPrice <= 0) {
            return {
                type: "text",
                content: [
                    "❌ لطفاً یک قیمت معتبر به تومان وارد کنید.",
                    "",
                    "مثال: <code>23000000</code>",
                    "",
                    "یا برای لغو: /cancel"
                ].join("\n")
            };
        }

        // Create the alert
        const alert = await this.alertService.create(
            userId,
            targetPrice,
            direction
        );

        const dirLabel = direction === "ABOVE"
            ? "⬆️ بالاتر از"
            : "⬇️ پایین‌تر از";

        // Clean up session
        await this.sessionStore.delete(userId);

        return {
            type: "text",
            content: [
                "✅ <b>هشدار ثبت شد!</b>",
                "",
                `📍 هشدار: قیمت طلا ${dirLabel}`,
                `💰 قیمت هدف: ${this.numberFormatter.money(targetPrice)}`,
                "",
                "وقتی قیمت به هدف رسید، بهتون اعلان میدیم.",
                "🔔 اعلان یک‌بار مصرفه — بعد از اعلان حذف میشه.",
                "",
                `🕐 ${now}`
            ].join("\n")
        };
    }
}
