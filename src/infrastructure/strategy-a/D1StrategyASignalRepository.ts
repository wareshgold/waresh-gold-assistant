import {
    StrategyASignal
} from "../../domain/strategy-a/entities/StrategyASignal";

import {
    StrategyASignalRepository
} from "../../domain/strategy-a/repositories/StrategyASignalRepository";

import {
    StrategyASignalIdentity
} from "../../domain/strategy-a/value-objects/StrategyASignalIdentity";

export class D1StrategyASignalRepository
    implements StrategyASignalRepository {

    constructor(
        private readonly db: D1Database
    ) {}

    async save(
        signal: StrategyASignal
    ): Promise<boolean> {
        const result =
            await this.db
                .prepare(
`
INSERT OR IGNORE INTO "strategy-a_signals"
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

    async findByIdentity(
        identity: StrategyASignalIdentity
    ): Promise<StrategyASignal | null> {
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
FROM "strategy-a_signals"
WHERE symbol = ?
  AND timeframe = ?
  AND signal_type = ?
  AND entry_price = ?
  AND strategy_version = ?
  AND generated_at = ?
LIMIT 1
`
                )
                .bind(
                    identity.symbol,
                    identity.timeframe,
                    identity.signalType,
                    identity.entryPrice,
                    identity.strategyVersion,
                    identity.generatedAt
                )
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
        if (!row) return null;

        return StrategyASignal.create({
            symbol: row.symbol,
            timeframe: row.timeframe,
            signalType: row.signal_type as StrategyASignal["signalType"],
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

    async getLatest(
        symbol: string
    ): Promise<StrategyASignal | null> {
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
FROM "strategy-a_signals"
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

        return StrategyASignal.create({
            symbol: row.symbol,
            timeframe: row.timeframe,
            signalType: row.signal_type as StrategyASignal["signalType"],
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