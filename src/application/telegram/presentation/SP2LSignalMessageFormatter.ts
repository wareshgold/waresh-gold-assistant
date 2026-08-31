import {
    SP2LSignal
} from "../../../domain/sp2l/entities/SP2LSignal";

import {
    faNumber
} from "../../../shared/utils/number";

export class SP2LSignalMessageFormatter {

    format(
        signal: SP2LSignal
    ): string {

        if (!signal.isActionable()) {
            return `
⚪ SP2L SIGNAL

Symbol: ${signal.symbol}
Timeframe: ${signal.timeframe}

Status:
HOLD / عدم ورود

Entry Reference:
${this.formatNumber(signal.entryPrice)}

Reason:
${signal.reason}

Confidence:
${this.formatNumber(signal.confidence * 100)}٪

Strategy:
${signal.strategyVersion}
`.trim();
        }

        const directionIcon =
            signal.signalType === "BUY"
                ? "🟢"
                : "🔴";

        return `
${directionIcon} SP2L SIGNAL

Symbol: ${signal.symbol}
Timeframe: ${signal.timeframe}

Direction:
${signal.signalType}

Entry:
${this.formatNumber(signal.entryPrice)}

SL:
${this.formatNumber(signal.stopLoss)}

TP:
${this.formatNumber(signal.takeProfit)}

Risk Reward:
1:${this.formatNumber(signal.riskReward)}

Confidence:
${this.formatNumber(signal.confidence * 100)}٪

Strategy:
${signal.strategyVersion}

Reason:
${signal.reason}
`.trim();
    }


    private formatNumber(
        value:number
    ):string {

        return faNumber(value, 2);
    }
}
