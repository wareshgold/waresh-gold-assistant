import { StrategyASignal } from "../../../domain/strategy-a/entities/StrategyASignal";
import { faNumber, formatGrouped } from "../../../shared/utils/number";

export class StrategyASignalMessageFormatter {
    format(signal: StrategyASignal): string {
        const direction = this.direction(signal.signalType);
        const isActionable = signal.isActionable();

        const lines: string[] = [
            direction.icon + " <b>سیگنال Strategy A</b>",
            "",
            `بازار: ${signal.symbol}  •  تایم‌فریم: ${signal.timeframe}`,
            `نسخه: ${signal.strategyVersion}`,
        ];

        if (isActionable) {
            lines.push(
                `جهت: <b>${direction.label}</b>`,
                "",
                `ورود   ${this.copyablePrice(signal.entryPrice)}`,
                `حد ضرر ${this.copyablePrice(signal.stopLoss)}`,
                `هدف    ${this.copyablePrice(signal.takeProfit)}`,
                "",
                `ریسک به بازده: ۱:${faNumber(signal.riskReward, 2)}`,
                `اطمینان: ${faNumber(Math.round(signal.confidence * 100))}٪`,
            );
        } else {
            lines.push(
                "وضعیت: <b>انتظار</b>",
            );
        }

        lines.push(
            "",
            `💡 ${signal.reason}`
        );

        return lines.join("\n");
    }

    private direction(signalType: string): { icon: string; label: string } {
        switch (signalType) {
            case "BUY":
                return { icon: "🟢", label: "خرید" };
            case "SELL":
                return { icon: "🔴", label: "فروش" };
            default:
                return { icon: "⚪", label: "خنثی" };
        }
    }

    /**
     * Trading levels stay copyable: Latin digits with "," grouping
     * inside a <code> block so they work when pasted into any tool.
     */
    private copyablePrice(value: number): string {
        return "<code>" + formatGrouped(value, 2) + "</code>";
    }
}
