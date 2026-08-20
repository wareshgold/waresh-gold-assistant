import {
    SP2LMarketData
} from "../../domain/sp2l/value-objects/SP2LMarketData";

import {
    SP2LSignal
} from "../../domain/sp2l/entities/SP2LSignal";

export interface StrategyEngine {
    evaluate(
        marketData: SP2LMarketData
    ): SP2LSignal;
}