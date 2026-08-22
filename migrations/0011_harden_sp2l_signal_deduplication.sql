ALTER TABLE sp2l_signals
ADD COLUMN reason TEXT NOT NULL DEFAULT '';

ALTER TABLE sp2l_signals
ADD COLUMN fingerprint TEXT;

UPDATE sp2l_signals
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

DELETE FROM sp2l_signals
WHERE id NOT IN (
    SELECT MAX(id)
    FROM sp2l_signals
    GROUP BY fingerprint
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sp2l_signals_fingerprint
ON sp2l_signals(fingerprint);
