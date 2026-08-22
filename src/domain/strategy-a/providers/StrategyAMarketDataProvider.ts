import {
    StrategyAMarketData
} from "../value-objects/StrategyAMarketData";

export interface StrategyAMarketDataProvider {
    getMarketData(
        symbol: string,
        timeframe: string
    ): Promise<StrategyAMarketData>;
}