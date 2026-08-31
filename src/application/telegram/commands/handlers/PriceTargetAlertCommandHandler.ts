import { TelegramCommandContext } from "../TelegramCommandContext";
import { TelegramCommandHandler } from "../TelegramCommandHandler";
import { PriceTargetAlertService } from "../../../price-target-alert/PriceTargetAlertService";
import { TelegramDateTimeFormatter } from "../../presentation/TelegramDateTimeFormatter";
import { TelegramNumberFormatter } from "../../presentation/TelegramNumberFormatter";
import { TelegramSessionStore } from "../../state/TelegramSessionStore";

export class PriceTargetAlertCommandHandler implements TelegramCommandHandler {
    private readonly dateTimeFormatter = new TelegramDateTimeFormatter();
    private readonly numberFormatter = new TelegramNumberFormatter();

    constructor(
        private readonly alertService: PriceTargetAlertService,
        private readonly sessionStore?: TelegramSessionStore
    ) {}

    metadata() {
        return {
            command: "/price-target",
            description: "هشدار رسیدن به قیمت"
        };
    }

    canHandle(command: string): boolean {
        const normalized = command.trim().toLowerCase();
        return normalized === "/price-target" || normalized === "price-target";
    }

    async execute(context: TelegramCommandContext) {
        const userId = context.userId ?? "";
        const args = context.arguments;
        const now = this.dateTimeFormatter.format();
        const actionId = (context.metadata as Record<string, unknown> | undefined)?.actionId as string | undefined;

        // Handle "🎯 هشدار رسیدن به قیمت" menu item
        if (actionId === "alerts.price-target") {
            return this.showTargetAlerts(userId, now);
        }

        // Handle cancel all
        if (actionId === "price-target-cancel-all") {
            await this.alertService.cancelAll(userId);
            return {
                type: "text" as const,
                content: [
                    "🔕 <b>همه هشدارها لغو شد</b>",
                    "",
                    `🕐 ${now}`
                ].join("\n")
            };
        }

        // Handle specific cancel: price-target-cancel:<id>
        if (actionId?.startsWith("price-target-cancel:")) {
            const alertId = actionId.split(":")[1];
            await this.alertService.cancel(alertId);
            return this.showTargetAlerts(userId, now);
        }

        // Handle inline buttons: price-target-above, price-target-below
        if (actionId === "price-target-above" || actionId === "price-target-below") {
            const direction = actionId === "price-target-above" ? "ABOVE" : "BELOW";
            const dirLabel = direction === "ABOVE" ? "بالاتر از" : "پایین‌تر از";

            // Save session state so the conversation flow can pick up the input
            if (this.sessionStore) {
                await this.sessionStore.save({
                    userId,
                    state: "price-target-awaiting-input",
                    data: { direction },
                    updatedAt: Date.now()
                });
            }

            return {
                type: "text" as const,
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

        // Handle text input for target price
        if (args.length > 0) {
            const targetPrice = Number(args[0].replace(/[,،]/g, ""));
            const direction = (context.metadata as Record<string, unknown> | undefined)?.direction as string | undefined;

            if (!targetPrice || targetPrice <= 0 || !direction) {
                return {
                    type: "text" as const,
                    content: "❌ لطفاً یک قیمت معتبر به تومان وارد کنید."
                };
            }

            const dir = direction as "ABOVE" | "BELOW";
            const alert = await this.alertService.create(userId, targetPrice, dir);
            const dirLabel = dir === "ABOVE" ? "⬆️ بالاتر از" : "⬇️ پایین‌تر از";

            return {
                type: "text" as const,
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

        return this.showTargetAlerts(userId, now);
    }

    private async showTargetAlerts(userId: string, now: string) {
        const alerts = await this.alertService.getActiveByUser(userId);

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
                    "هشدار یک‌بار مصرفه — بعد از اعلان حذف میشه."
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

        const alertList = alerts.map((alert, i) => {
            const dirLabel = alert.direction === "ABOVE" ? "⬆️ بالاتر از" : "⬇️ پایین‌تر از";
            return `${i + 1}. ${dirLabel} ${this.numberFormatter.money(alert.targetPrice)}`;
        }).join("\n");

        const cancelButtons = alerts.map(alert => ({
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
