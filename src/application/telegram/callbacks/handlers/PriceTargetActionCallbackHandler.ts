import { TelegramCallbackHandler } from "../TelegramCallbackHandler";
import { TelegramCallbackContext } from "../TelegramCallbackContext";
import { TelegramCommandResponse } from "../../commands/TelegramCommandHandler";
import { TelegramSessionStore } from "../../state/TelegramSessionStore";
import { TelegramDateTimeFormatter } from "../../presentation/TelegramDateTimeFormatter";

export class PriceTargetActionCallbackHandler implements TelegramCallbackHandler {
    private readonly dateTimeFormatter = new TelegramDateTimeFormatter();

    constructor(private readonly sessionStore: TelegramSessionStore) {}

    canHandle(context: TelegramCallbackContext): boolean {
        const callbackAction = `${context.callback.namespace}.${context.callback.action}`;
        return callbackAction === "price-target.above"
            || callbackAction === "price-target.below";
    }

    async execute(context: TelegramCallbackContext): Promise<TelegramCommandResponse> {
        const userId = context.userId ?? "";
        const direction = context.callback.action === "above" ? "ABOVE" : "BELOW";
        const dirLabel = direction === "ABOVE" ? "بالاتر از" : "پایین‌تر از";
        const now = this.dateTimeFormatter.format();

        // Save session state so conversation flow can pick up the input
        await this.sessionStore.save({
            userId,
            state: "price-target-awaiting-input",
            data: { direction },
            updatedAt: Date.now()
        });

        return {
            type: "text",
            content: [
                "🎯 <b>هشدار رسیدن به قیمت</b>",
                "",
                `قیمت طلا از ${dirLabel} چه مبلغی رسید، بهتون اعلان بده؟`,
                "",
                "💬 قیمت رو به تومان بنویسید:",
                "مثال: <code>23000000</code>",
                "",
                "⚠️ قیمت باید به تومان باشد"
            ].join("\n")
        };
    }
}
