import {
    StrategyASignal
} from "../../domain/strategy-a/entities/StrategyASignal";

import {
    SignalLevelNotifier
} from "../../application/strategy/strategy-a/MonitorSignalLevelsUseCase";

import {
    TelegramBotClient
} from "../telegram/TelegramBotClient";

import {
    TelegramDateTimeFormatter
} from "../../application/telegram/presentation/TelegramDateTimeFormatter";

export class TelegramSignalLevelNotifier
    implements SignalLevelNotifier {

    private readonly dateTimeFormatter =
        new TelegramDateTimeFormatter();

    constructor(
        private readonly botClient: TelegramBotClient
    ) {}

    async notifyLevelHit(
        telegramUserIds: string[],
        signal: StrategyASignal,
        hitType: "TP_HIT" | "SL_HIT",
        currentPrice: number
    ): Promise<void> {
        const text =
            this.formatMessage(
                signal,
                hitType,
                currentPrice
            );

        for (const chatId of telegramUserIds) {
            try {
                await this.botClient.sendMessage({
                    chatId,
                    text,
                    parseMode: "HTML"
                });
            } catch (error) {
                console.error(
                    "Signal level notify failed",
                    {
                        chatId,
                        error
                    }
                );
            }
        }
    }

    private formatMessage(
        signal: StrategyASignal,
        hitType: "TP_HIT" | "SL_HIT",
        currentPrice: number
    ): string {
        const icon =
            hitType === "TP_HIT" ? "🎯" : "🛑";

        const label =
            hitType === "TP_HIT"
                ? "حد سود رسید"
                : "حد ضرر خورد";

        const direction =
            signal.signalType === "BUY"
                ? "🟢 خرید"
                : "🔴 فروش";

        const pnl =
            signal.signalType === "BUY"
                ? currentPrice - signal.entryPrice
                : signal.entryPrice - currentPrice;

        const pnlPercent =
            signal.entryPrice > 0
                ? (pnl / signal.entryPrice) * 100
                : 0;

        const pnlIcon =
            pnl >= 0 ? "📈" : "📉";

        const now =
            this.dateTimeFormatter.format();

        return [
            `${icon} <b>${label}</b>`,
            "",
            `بازار: ${signal.symbol}  •  تایم‌فریم: ${signal.timeframe}`,
            `جهت: ${direction}`,
            "",
            `ورود   <code>${signal.entryPrice}</code>`,
            `قیمت فعلی <code>${currentPrice}</code>`,
            hitType === "TP_HIT"
                ? `هدف   <code>${signal.takeProfit}</code>`
                : `حد ضرر <code>${signal.stopLoss}</code>`,
            "",
            `${pnlIcon} سود/ضرر: <code>${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}</code> (${pnlPercent >= 0 ? "+" : ""}${pnlPercent.toFixed(2)}٪)`,
            "",
            `🕐 ${now}`
        ].join("\n");
    }
}
