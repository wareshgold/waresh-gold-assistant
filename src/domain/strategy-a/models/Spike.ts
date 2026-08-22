import {
    StrategyADirection
} from "../value-objects/StrategyASignalType";

export interface Spike {
    direction: StrategyADirection;
    startPrice: number;
    endPrice: number;
    startIndex: number;
    endIndex: number;
    strength: number;
    gapSize: number;
    candlesCount: number;
    extremeHigh: number;
    extremeLow: number;
}