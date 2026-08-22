export enum GoldPriceAlertInterval {
    ONE_HOUR = 1,
    SIX_HOURS = 6,
    TWELVE_HOURS = 12
}

export const GOLD_PRICE_ALERT_INTERVALS = [
    GoldPriceAlertInterval.ONE_HOUR,
    GoldPriceAlertInterval.SIX_HOURS,
    GoldPriceAlertInterval.TWELVE_HOURS
] as const;

export function isGoldPriceAlertInterval(
    value: number
): value is GoldPriceAlertInterval {
    return GOLD_PRICE_ALERT_INTERVALS.includes(
        value as GoldPriceAlertInterval
    );
}
