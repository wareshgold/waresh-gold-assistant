import {
    SP2LDirection
} from "../value-objects/SP2LSignalType";

export interface Spike {
    direction: SP2LDirection;
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