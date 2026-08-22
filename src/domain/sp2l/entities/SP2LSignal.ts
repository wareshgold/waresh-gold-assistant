import {
    SP2LSignalType
} from "../value-objects/SP2LSignalType";

import {
    Spike
} from "../models/Spike";

import {
    TwoLeg
} from "../models/TwoLeg";

import {
    EntryLevel
} from "../models/EntryLevel";

export interface SP2LSignalProps {
    symbol: string;
    timeframe: string;
    signalType: SP2LSignalType;
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
    riskReward: number;
    confidence: number;
    reason: string;
    generatedAt: Date;
    strategyVersion: string;
    spikeData?: Spike;
    twoLegData?: TwoLeg;
    levelData?: EntryLevel;
}

export class SP2LSignal {

    readonly symbol: string;
    readonly timeframe: string;
    readonly signalType: SP2LSignalType;
    readonly entryPrice: number;
    readonly stopLoss: number;
    readonly takeProfit: number;
    readonly riskReward: number;
    readonly confidence: number;
    readonly reason: string;
    readonly generatedAt: Date;
    readonly strategyVersion: string;
    readonly spikeData?: Spike;
    readonly twoLegData?: TwoLeg;
    readonly levelData?: EntryLevel;

    private constructor(
        props: SP2LSignalProps
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
        this.spikeData = props.spikeData;
        this.twoLegData = props.twoLegData;
        this.levelData = props.levelData;
    }

    static create(
        props: SP2LSignalProps
    ): SP2LSignal {
        return new SP2LSignal(props);
    }

    static hold(
        props: {
            symbol: string;
            timeframe: string;
            strategyVersion: string;
            reason: string;
            entryPrice?: number;
        }
    ): SP2LSignal {
        return new SP2LSignal({
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
}
