/**
 * Market Regime / Opportunity Window definitions for XAUUSD Strategy A
 * 
 * Based on research: XAUUSD behaves differently during different sessions.
 * Opportunity Windows filter for periods with higher probability of
 * quality structural setups.
 * 
 * All times are in Tehran time (UTC+3:30)
 */

export type MarketRegimeType =
    | "LONDON_OPEN"
    | "PRE_NY_BUILD"
    | "LONDON_NY_OVERLAP"
    | "NY_OPEN"
    | "OTHER";

export interface OpportunityWindow {
    type: MarketRegimeType;
    label: string;
    startHour: number;  // Tehran time
    startMinute: number;
    endHour: number;    // Tehran time
    endMinute: number;
    priority: number;   // 1 = highest priority
}

/**
 * Current Opportunity Windows based on research
 * 
 * Times are in Tehran time (UTC+3:30)
 */
export const OPPORTUNITY_WINDOWS: OpportunityWindow[] = [
    {
        type: "LONDON_OPEN",
        label: "لندن - شروع",
        startHour: 13, startMinute: 30,  // 13:30 Tehran = 10:00 UTC (London Open)
        endHour: 15, endMinute: 0,       // 15:00 Tehran = 11:30 UTC
        priority: 2
    },
    {
        type: "PRE_NY_BUILD",
        label: "پیش از نیویورک",
        startHour: 16, startMinute: 30,  // 16:30 Tehran = 13:00 UTC (Pre-NY)
        endHour: 17, endMinute: 30,      // 17:30 Tehran = 14:00 UTC
        priority: 1  // Highest priority based on research
    },
    {
        type: "LONDON_NY_OVERLAP",
        label: "لندن - نیویورک",
        startHour: 17, startMinute: 30,  // 17:30 Tehran = 14:00 UTC
        endHour: 20, endMinute: 30,      // 20:30 Tehran = 17:00 UTC
        priority: 2
    },
    {
        type: "NY_OPEN",
        label: "نیویورک - شروع",
        startHour: 17, startMinute: 30,  // 17:30 Tehran = 14:00 UTC (NY Open)
        endHour: 19, endMinute: 0,       // 19:00 Tehran = 15:30 UTC
        priority: 3
    }
];

export class MarketRegime {
    /**
     * Get current market regime based on Tehran time
     */
    static getCurrent(utcNow: Date = new Date()): {
        regime: MarketRegimeType;
        label: string;
        isOpportunityWindow: boolean;
        priority: number;
    } {
        // Convert UTC to Tehran time (UTC+3:30)
        const tehranTime = new Date(utcNow.getTime() + (3 * 60 + 30) * 60 * 1000);
        const hour = tehranTime.getUTCHours();
        const minute = tehranTime.getUTCMinutes();
        const currentMinutes = hour * 60 + minute;

        for (const window of OPPORTUNITY_WINDOWS) {
            const startMinutes = window.startHour * 60 + window.startMinute;
            const endMinutes = window.endHour * 60 + window.endMinute;

            if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
                return {
                    regime: window.type,
                    label: window.label,
                    isOpportunityWindow: true,
                    priority: window.priority
                };
            }
        }

        return {
            regime: "OTHER",
            label: "خارج از ساعات معاملاتی",
            isOpportunityWindow: false,
            priority: 0
        };
    }

    /**
     * Check if current time is in an Opportunity Window
     */
    static isInOpportunityWindow(utcNow: Date = new Date()): boolean {
        return this.getCurrent(utcNow).isOpportunityWindow;
    }

    /**
     * Get all regime types that are currently active
     */
    static getActiveRegimes(utcNow: Date = new Date()): MarketRegimeType[] {
        const current = this.getCurrent(utcNow);
        if (!current.isOpportunityWindow) {
            return ["OTHER"];
        }
        return [current.regime];
    }
}
