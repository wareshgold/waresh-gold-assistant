import { StrategyASignal } from "../../../domain/strategy-a/entities/StrategyASignal";

export class StrategyASignalMessageFormatter {
    format(signal: StrategyASignal): string {
        const direction = this.direction(signal.signalType);
        const isActionable = signal.isActionable();

        const lines: string[] = [
            `${direction.icon} <b>سیگنال Strategy A</b>`,
            "",
            `بازار: ${signal.symbol}  •  تایم‌فریم: ${signal.timeframe}`,
            `نسخه: ${signal.strategyVersion}`,
        ];

        if (isActionable) {
            lines.push(
                `جهت: <b>${direction.label}</b>`,
                "",
                `ورود   <code>${this.formatNumber(signal.entryPrice)}</code>`,
                `حد ضرر <code>${this.formatNumber(signal.stopLoss)}</code>`,
                `هدف    <code>${this.formatNumber(signal.takeProfit)}</code>`,
                "",
                `ریسک به بازده: 1:${this.formatNumber(signal.riskReward)}`,
                `اطمینان: ${Math.round(signal.confidence * 100)}٪`,
            );
        } else {
            lines.push(
                `وضعیت: <b>انتظار</b>`,
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

    private formatNumber(value: number): string {
        return new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 2,
        }).format(value);
    }
}
