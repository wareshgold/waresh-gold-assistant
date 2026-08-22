import {
    StrategyASignal
} from "../../../domain/strategy-a/entities/StrategyASignal";

export class StrategyASignalMessageFormatter {

    format(
        signal: StrategyASignal
    ): string {
        const directionIcon =
            signal.signalType === "BUY"
                ? "🟢"
                : signal.signalType === "SELL"
                    ? "🔴"
                    : "⚪";

        return `
${directionIcon} StrategyA SIGNAL

Symbol: ${signal.symbol}
Timeframe: ${signal.timeframe}
Direction: ${signal.signalType}
Entry: ${this.formatNumber(signal.entryPrice)}
SL: ${this.formatNumber(signal.stopLoss)}
TP: ${this.formatNumber(signal.takeProfit)}
Risk: 1:${this.formatNumber(signal.riskReward)}
Confidence: ${Math.round(signal.confidence * 100)}%
Strategy: ${signal.strategyVersion}
Reason: ${signal.reason}
`.trim();
    }

    private formatNumber(
        value: number
    ): string {
        return new Intl.NumberFormat(
            "en-US",
            {
                maximumFractionDigits: 2
            }
        ).format(value);
    }
}