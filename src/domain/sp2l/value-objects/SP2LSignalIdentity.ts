import type { SP2LSignal } from "../entities/SP2LSignal";

/**
 * Stable identity for an SP2L signal.
 * Execution time is intentionally excluded so repeated evaluations of the
 * same market setup resolve to the same identity.
 */
export interface SP2LSignalIdentity {
    symbol: string;
    timeframe: string;
    direction: SP2LSignal["direction"];
    triggerCandleIndex: number;
    entryPrice: number;
}

export function createSP2LSignalIdentity(signal: SP2LSignal): SP2LSignalIdentity {
    return {
        symbol: signal.symbol,
        timeframe: signal.timeframe,
        direction: signal.direction,
        triggerCandleIndex: signal.entry.triggerCandleIndex,
        entryPrice: signal.entry.price
    };
}

export function serializeSP2LSignalIdentity(identity: SP2LSignalIdentity): string {
    return [
        identity.symbol,
        identity.timeframe,
        identity.direction,
        identity.triggerCandleIndex,
        identity.entryPrice
    ].join(":");
}
