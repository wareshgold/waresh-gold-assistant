import type { StrategyASignal } from "../entities/StrategyASignal";

/**
 * Stable identity for an StrategyA signal.
 * The evaluation timestamp is the timestamp of the last market candle, so
 * repeated evaluations of the same candle are identical while a new candle
 * creates a new signal identity.
 */
export interface StrategyASignalIdentity {
    symbol: string;
    timeframe: string;
    signalType: StrategyASignal["signalType"];
    entryPrice: number;
    strategyVersion: string;
    generatedAt: number;
}

export function createStrategyASignalIdentity(signal: StrategyASignal): StrategyASignalIdentity {
    return {
        symbol: signal.symbol,
        timeframe: signal.timeframe,
        signalType: signal.signalType,
        entryPrice: signal.entryPrice,
        strategyVersion: signal.strategyVersion,
        generatedAt: signal.generatedAt.getTime()
    };
}

export function serializeStrategyASignalIdentity(identity: StrategyASignalIdentity): string {
    return JSON.stringify([
        identity.symbol,
        identity.timeframe,
        identity.signalType,
        identity.entryPrice,
        identity.strategyVersion,
        identity.generatedAt
    ]);
}
