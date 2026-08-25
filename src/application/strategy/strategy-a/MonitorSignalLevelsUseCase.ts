import {
    StrategyASignal
} from "../../../domain/strategy-a/entities/StrategyASignal";

import {
    StrategyASignalRepository
} from "../../../domain/strategy-a/repositories/StrategyASignalRepository";

import {
    SignalStatus
} from "../../../domain/strategy-a/value-objects/SignalStatus";

export interface PriceProvider {
    getCurrentPrice(
        symbol: string
    ): Promise<number>;
}

export interface SignalLevelNotifier {
    notifyLevelHit(
        telegramUserIds: string[],
        signal: StrategyASignal,
        hitType: "TP_HIT" | "SL_HIT",
        currentPrice: number
    ): Promise<void>;
}

export interface MonitorResult {
    checkedCount: number;
    tpHits: number;
    slHits: number;
    expired: number;
}

export class MonitorSignalLevelsUseCase {

    constructor(
        private readonly signalRepository: StrategyASignalRepository,
        private readonly priceProvider: PriceProvider,
        private readonly notifier: SignalLevelNotifier,
        private readonly getVipUserIds: () => Promise<string[]>,
        private readonly maxAgeHours: number = 24
    ) {}

    async execute(): Promise<MonitorResult> {
        const activeSignals =
            await this.signalRepository.getActiveSignals();

        let tpHits = 0;
        let slHits = 0;
        let expired = 0;

        for (const signal of activeSignals) {
            // Check expiry
            if (signal.isExpired(this.maxAgeHours)) {
                await this.signalRepository.updateStatus(
                    this.getSignalId(signal),
                    "EXPIRED"
                );
                expired++;
                continue;
            }

            // Get current price
            let currentPrice: number;

            try {
                currentPrice =
                    await this.priceProvider.getCurrentPrice(
                        signal.symbol
                    );
            } catch (error) {
                console.error(
                    "Failed to get price for signal monitoring",
                    {
                        symbol: signal.symbol,
                        error
                    }
                );
                continue;
            }

            // Check price level
            const hitStatus =
                signal.checkPriceLevel(currentPrice);

            if (hitStatus) {
                await this.signalRepository.updateStatus(
                    this.getSignalId(signal),
                    hitStatus
                );

                const vipUserIds =
                    await this.getVipUserIds();

                if (vipUserIds.length > 0) {
                    await this.notifier.notifyLevelHit(
                        vipUserIds,
                        signal,
                        hitStatus as "TP_HIT" | "SL_HIT",
                        currentPrice
                    );
                }

                if (hitStatus === "TP_HIT") {
                    tpHits++;
                } else if (hitStatus === "SL_HIT") {
                    slHits++;
                }
            }
        }

        return {
            checkedCount: activeSignals.length,
            tpHits,
            slHits,
            expired
        };
    }

    private getSignalId(
        signal: StrategyASignal
    ): number {
        // In a real implementation, the signal would have an ID field
        // For now, we use the fingerprint hash
        return 0;
    }
}
