ALTER TABLE "strategy-a_signals"
ADD COLUMN reason TEXT NOT NULL DEFAULT '';

ALTER TABLE "strategy-a_signals"
ADD COLUMN fingerprint TEXT;

UPDATE "strategy-a_signals"
SET fingerprint = json_array(
    symbol,
    timeframe,
    signal_type,
    entry_price,
    stop_loss,
    take_profit,
    strategy_version,
    generated_at
);

DELETE FROM "strategy-a_signals"
WHERE id NOT IN (
    SELECT MAX(id)
    FROM "strategy-a_signals"
    GROUP BY fingerprint
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_strategy_a_signals_fingerprint
ON "strategy-a_signals"(fingerprint);