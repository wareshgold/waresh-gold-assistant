import {
    SP2LSignal
} from "../../domain/sp2l/entities/SP2LSignal";

import {
    SP2LSignalRepository
} from "../../domain/sp2l/repositories/SP2LSignalRepository";

export class D1SP2LSignalRepository
    implements SP2LSignalRepository {

    constructor(
        private readonly db: D1Database
    ) {}

    async save(
        signal: SP2LSignal
    ): Promise<boolean> {
        const result =
            await this.db
                .prepare(
`
INSERT OR IGNORE INTO sp2l_signals
(
    symbol,
    timeframe,
    signal_type,
    entry_price,
    stop_loss,
    take_profit,
    risk_reward,
    confidence,
    reason,
    strategy_version,
    generated_at,
    fingerprint
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`
                )
                .bind(
                    signal.symbol,
                    signal.timeframe,
                    signal.signalType,
                    signal.entryPrice,
                    signal.stopLoss,
                    signal.takeProfit,
                    signal.riskReward,
                    signal.confidence,
                    signal.reason,
                    signal.strategyVersion,
                    signal.generatedAt.getTime(),
                    signal.getFingerprint()
                )
                .run();

        return result.meta.changes === 1;
    }

    async getLatest(
        symbol: string
    ): Promise<SP2LSignal | null> {
        const result =
            await this.db
                .prepare(
`
SELECT
    symbol,
    timeframe,
    signal_type,
    entry_price,
    stop_loss,
    take_profit,
    risk_reward,
    confidence,
    reason,
    strategy_version,
    generated_at
FROM sp2l_signals
WHERE symbol = ?
ORDER BY generated_at DESC, id DESC
LIMIT 1
`
                )
                .bind(symbol)
                .all<{
                    symbol: string;
                    timeframe: string;
                    signal_type: string;
                    entry_price: number;
                    stop_loss: number;
                    take_profit: number;
                    risk_reward: number;
                    confidence: number;
                    reason: string;
                    strategy_version: string;
                    generated_at: number;
                }>();

        const row = result.results?.[0];

        if (!row) {
            return null;
        }

        return SP2LSignal.create({
            symbol: row.symbol,
            timeframe: row.timeframe,
            signalType: row.signal_type as SP2LSignal["signalType"],
            entryPrice: Number(row.entry_price),
            stopLoss: Number(row.stop_loss),
            takeProfit: Number(row.take_profit),
            riskReward: Number(row.risk_reward),
            confidence: Number(row.confidence),
            reason: row.reason,
            generatedAt: new Date(Number(row.generated_at)),
            strategyVersion: row.strategy_version
        });
    }
}
