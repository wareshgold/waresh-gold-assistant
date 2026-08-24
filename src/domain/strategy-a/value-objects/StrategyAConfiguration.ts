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
    minBodyRatio: 0.65,
    minSpikeRangeMultiplier: 1.8,
    minSpikeMovePercent: 0.12,
    minGapRatio: 0.15,
    minRetracementPercent: 20,
    maxRetracementPercent: 85,
    riskReward: 1
};
