import {
    StrategyASignalType
} from "../value-objects/StrategyASignalType";

import {
    SignalStatus
} from "../value-objects/SignalStatus";

import {
    Spike
} from "../models/Spike";

import {
    TwoLeg
} from "../models/TwoLeg";

import {
    EntryLevel
} from "../models/EntryLevel";

export interface StrategyASignalProps {
    symbol: string;
    timeframe: string;
    signalType: StrategyASignalType;
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
    riskReward: number;
    confidence: number;
    reason: string;
    generatedAt: Date;
    strategyVersion: string;
    status?: SignalStatus;
    spikeData?: Spike;
    twoLegData?: TwoLeg;
    levelData?: EntryLevel;
}

export class StrategyASignal {

    readonly symbol: string;
    readonly timeframe: string;
    readonly signalType: StrategyASignalType;
    readonly entryPrice: number;
    readonly stopLoss: number;
    readonly takeProfit: number;
    readonly riskReward: number;
    readonly confidence: number;
    readonly reason: string;
    readonly generatedAt: Date;
    readonly strategyVersion: string;
    readonly status: SignalStatus;
    readonly spikeData?: Spike;
    readonly twoLegData?: TwoLeg;
    readonly levelData?: EntryLevel;

    private constructor(
        props: StrategyASignalProps
    ) {
        this.symbol = props.symbol;
        this.timeframe = props.timeframe;
        this.signalType = props.signalType;
        this.entryPrice = props.entryPrice;
        this.stopLoss = props.stopLoss;
        this.takeProfit = props.takeProfit;
        this.riskReward = props.riskReward;
        this.confidence = props.confidence;
        this.reason = props.reason;
        this.generatedAt = props.generatedAt;
        this.strategyVersion = props.strategyVersion;
        this.status = props.status ?? "ACTIVE";
        this.spikeData = props.spikeData;
        this.twoLegData = props.twoLegData;
        this.levelData = props.levelData;
    }

    static create(
        props: StrategyASignalProps
    ): StrategyASignal {
        return new StrategyASignal(props);
    }

    static hold(
        props: {
            symbol: string;
            timeframe: string;
            strategyVersion: string;
            reason: string;
            entryPrice?: number;
        }
    ): StrategyASignal {
        return new StrategyASignal({
            symbol: props.symbol,
            timeframe: props.timeframe,
            signalType: "HOLD",
            entryPrice: props.entryPrice ?? 0,
            stopLoss: 0,
            takeProfit: 0,
            riskReward: 0,
            confidence: 0,
            reason: props.reason,
            generatedAt: new Date(),
            strategyVersion: props.strategyVersion
        });
    }

    getFingerprint(): string {
        return JSON.stringify([
            this.symbol,
            this.timeframe,
            this.signalType,
            this.entryPrice,
            this.stopLoss,
            this.takeProfit,
            this.strategyVersion,
            this.generatedAt.getTime()
        ]);
    }

    isActionable(): boolean {
        return (
            this.signalType === "BUY" ||
            this.signalType === "SELL"
        );
    }

    /**
     * Check if current price has hit SL or TP.
     * Returns the terminal status if hit, null otherwise.
     */
    checkPriceLevel(
        currentPrice: number
    ): SignalStatus | null {
        if (!this.isActionable()) {
            return null;
        }

        if (this.signalType === "BUY") {
            if (currentPrice <= this.stopLoss) {
                return "SL_HIT";
            }
            if (currentPrice >= this.takeProfit) {
                return "TP_HIT";
            }
        } else {
            // SELL
            if (currentPrice >= this.stopLoss) {
                return "SL_HIT";
            }
            if (currentPrice <= this.takeProfit) {
                return "TP_HIT";
            }
        }

        return null;
    }

    /**
     * Check if signal has expired (older than maxAgeHours).
     */
    isExpired(
        maxAgeHours: number = 24
    ): boolean {
        const ageMs =
            Date.now() -
            this.generatedAt.getTime();

        return ageMs > maxAgeHours * 60 * 60 * 1000;
    }
}
