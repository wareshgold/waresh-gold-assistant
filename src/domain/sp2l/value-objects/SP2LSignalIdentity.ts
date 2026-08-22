import type { SP2LSignal } from "../entities/SP2LSignal";

/**
 * Stable identity for an SP2L signal.
 * The evaluation timestamp is the timestamp of the last market candle, so
 * repeated evaluations of the same candle are identical while a new candle
 * creates a new signal identity.
 */
export interface SP2LSignalIdentity {
    symbol: string;
    timeframe: string;
    signalType: SP2LSignal["signalType"];
    entryPrice: number;
    strategyVersion: string;
    generatedAt: number;
}

export function createSP2LSignalIdentity(signal: SP2LSignal): SP2LSignalIdentity {
    return {
        symbol: signal.symbol,
        timeframe: signal.timeframe,
        signalType: signal.signalType,
        entryPrice: signal.entryPrice,
        strategyVersion: signal.strategyVersion,
        generatedAt: signal.generatedAt.getTime()
    };
}

export function serializeSP2LSignalIdentity(identity: SP2LSignalIdentity): string {
    return JSON.stringify([
        identity.symbol,
        identity.timeframe,
        identity.signalType,
        identity.entryPrice,
        identity.strategyVersion,
        identity.generatedAt
    ]);
}
