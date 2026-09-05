export interface StrategyAConfiguration {
    symbol: string;
    timeframe: string;
    strategyVersion: string;

    /** Minimum consecutive strong candles to form a spike */
    minSpikeCandles: number;
    maxSpikeCandles: number;

    /** Body must be at least this fraction of candle range */
    minBodyRatio: number;

    /** Spike range vs average range multiplier */
    minSpikeRangeMultiplier: number;

    /** Minimum total spike move as % of start price */
    minSpikeMovePercent: number;

    /** Minimum gap contribution relative to average range */
    minGapRatio: number;

    /** 2Leg retracement band of spike range */
    minRetracementPercent: number;
    maxRetracementPercent: number;

    /** Risk:reward for TP v1 */
    riskReward: number;
}

export const DEFAULT_StrategyA_CONFIGURATION: StrategyAConfiguration = {
    symbol: "XAUUSD",
    timeframe: "M5",
    strategyVersion: "StrategyA-v1",
    minSpikeCandles: 3,
    maxSpikeCandles: 3,
    minBodyRatio: 0.55,           // was 0.65 - lowered to capture more signals
    minSpikeRangeMultiplier: 1.8,
    minSpikeMovePercent: 0.08,    // was 0.12 - lowered for smaller moves
    minGapRatio: 0.08,            // was 0.15 - lowered for smaller gaps
    minRetracementPercent: 20,
    maxRetracementPercent: 85,
    riskReward: 1
};
