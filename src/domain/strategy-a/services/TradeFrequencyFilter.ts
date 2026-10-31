import { StrategyASignal } from "../entities/StrategyASignal";

export interface TradeFrequencyState {
    tradesToday: number;
    maxTradesPerDay: number;
    lastTradeTime: Date | null;
    canTrade: boolean;
}

/**
 * Trade Frequency Filter
 * 
 * Limits the number of trades per day to prevent overtrading.
 * Based on research:
 * - Maximum ~5 trades per day
 * - Lower CAPs showed better equity curves in some timeframes
 * - But CAP should be an execution constraint, not source of edge
 * 
 * This filter ensures:
 * 1. Not too many trades per day
 * 2. Minimum time between trades (cooldown)
 * 3. Quality over quantity
 */
export class TradeFrequencyFilter {
    
    constructor(
        /**
         * Maximum trades allowed per day
         */
        private readonly maxTradesPerDay: number = 5,
        
        /**
         * Minimum minutes between trades
         */
        private readonly cooldownMinutes: number = 30
    ) {}

    /**
     * Check if a new trade is allowed
     * 
     * @param recentSignals - Recent signals from today
     * @param currentTime - Current time
     * @returns TradeFrequencyState
     */
    check(
        recentSignals: StrategyASignal[],
        currentTime: Date = new Date()
    ): TradeFrequencyState {
        // Filter signals from today only
        const todaySignals = this.getTodaySignals(recentSignals, currentTime);
        
        // Count actionable signals (BUY/SELL, not HOLD)
        const actionableTrades = todaySignals.filter(
            s => s.signalType !== "HOLD"
        );

        const tradesToday = actionableTrades.length;
        const lastTradeTime = this.getLastTradeTime(actionableTrades);
        
        // Check if we've hit the daily cap
        const hitCap = tradesToday >= this.maxTradesPerDay;
        
        // Check cooldown period
        const inCooldown = this.isInCooldown(lastTradeTime, currentTime);
        
        const canTrade = !hitCap && !inCooldown;

        return {
            tradesToday,
            maxTradesPerDay: this.maxTradesPerDay,
            lastTradeTime,
            canTrade
        };
    }

    /**
     * Get signals from today (Tehran time)
     */
    private getTodaySignals(
        signals: StrategyASignal[],
        currentTime: Date
    ): StrategyASignal[] {
        // Get start of today in Tehran time (UTC+3:30)
        const tehranTime = new Date(currentTime.getTime() + (3 * 60 + 30) * 60 * 1000);
        const startOfDay = new Date(tehranTime);
        startOfDay.setUTCHours(8, 0, 0, 0);  // Market opens at 8 AM Tehran
        
        // Convert back to UTC for comparison
        const startOfDayUTC = new Date(startOfDay.getTime() - (3 * 60 + 30) * 60 * 1000);

        return signals.filter(s => s.generatedAt >= startOfDayUTC);
    }

    /**
     * Get the time of the last trade
     */
    private getLastTradeTime(signals: StrategyASignal[]): Date | null {
        if (signals.length === 0) return null;
        
        const sorted = [...signals].sort(
            (a, b) => b.generatedAt.getTime() - a.generatedAt.getTime()
        );
        
        return sorted[0].generatedAt;
    }

    /**
     * Check if we're still in cooldown period after last trade
     */
    private isInCooldown(
        lastTradeTime: Date | null,
        currentTime: Date
    ): boolean {
        if (!lastTradeTime) return false;
        
        const diffMs = currentTime.getTime() - lastTradeTime.getTime();
        const diffMinutes = diffMs / (1000 * 60);
        
        return diffMinutes < this.cooldownMinutes;
    }

    /**
     * Get remaining trades allowed today
     */
    getRemainingTrades(
        recentSignals: StrategyASignal[],
        currentTime: Date = new Date()
    ): number {
        const state = this.check(recentSignals, currentTime);
        return Math.max(0, state.maxTradesPerDay - state.tradesToday);
    }

    /**
     * Get time until next trade is allowed
     */
    getTimeUntilNextTrade(
        recentSignals: StrategyASignal[],
        currentTime: Date = new Date()
    ): number | null {
        const state = this.check(recentSignals, currentTime);
        
        if (state.canTrade) return 0;
        if (!state.lastTradeTime) return null;
        
        const nextAllowedTime = new Date(
            state.lastTradeTime.getTime() + this.cooldownMinutes * 60 * 1000
        );
        
        const diffMs = nextAllowedTime.getTime() - currentTime.getTime();
        return Math.max(0, Math.ceil(diffMs / (1000 * 60)));
    }
}
