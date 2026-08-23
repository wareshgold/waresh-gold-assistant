export interface SP2LCandle {
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
    timestamp: number;
}

export interface SP2LMarketData {
    symbol: string;
    timeframe: string;
    candles: SP2LCandle[];
    fetchedAt: Date;
}