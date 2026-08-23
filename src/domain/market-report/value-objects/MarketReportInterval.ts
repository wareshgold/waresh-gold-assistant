export enum MarketReportInterval {
    ONE_HOUR = 1,
    SIX_HOURS = 6,
    TWELVE_HOURS = 12
}

export function isMarketReportInterval(value: number): value is MarketReportInterval {
    return [1, 6, 12].includes(value);
}
