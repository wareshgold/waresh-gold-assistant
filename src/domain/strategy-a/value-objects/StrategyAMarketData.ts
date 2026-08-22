export interface StrategyACandle {
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
    timestamp: number;
}

export interface StrategyAMarketData {
    symbol: string;
    timeframe: string;
    candles: StrategyACandle[];
    fetchedAt: Date;
}