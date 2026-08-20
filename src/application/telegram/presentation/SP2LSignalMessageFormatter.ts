import {
    SP2LSignal
} from "../../../domain/sp2l/entities/SP2LSignal";

export class SP2LSignalMessageFormatter {

    format(
        signal: SP2LSignal
    ): string {
        const directionIcon =
            signal.signalType === "BUY"
                ? "🟢"
                : signal.signalType === "SELL"
                    ? "🔴"
                    : "⚪";

        return `
${directionIcon} SP2L SIGNAL

Symbol: ${signal.symbol}
Timeframe: ${signal.timeframe}
Direction: ${signal.signalType}
Entry: ${this.formatNumber(signal.entryPrice)}
SL: ${this.formatNumber(signal.stopLoss)}
TP: ${this.formatNumber(signal.takeProfit)}
Risk: 1:${this.formatNumber(signal.riskReward)}
Confidence: ${Math.round(signal.confidence * 100)}%
Strategy: ${signal.strategyVersion}
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