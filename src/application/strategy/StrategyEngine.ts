import {
    StrategyAMarketData
} from "../../domain/strategy-a/value-objects/StrategyAMarketData";

import {
    StrategyASignal
} from "../../domain/strategy-a/entities/StrategyASignal";

export interface StrategyEngine {
    evaluate(
        marketData: StrategyAMarketData
    ): StrategyASignal;
}