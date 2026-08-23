import {
    SP2LMarketData
} from "../value-objects/SP2LMarketData";

export interface Sp2lMarketDataProvider {
    getMarketData(
        symbol: string,
        timeframe: string
    ): Promise<SP2LMarketData>;
}