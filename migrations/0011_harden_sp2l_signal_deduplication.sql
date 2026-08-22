ALTER TABLE sp2l_signals
ADD COLUMN reason TEXT NOT NULL DEFAULT '';

ALTER TABLE sp2l_signals
ADD COLUMN fingerprint TEXT;

UPDATE sp2l_signals
SET fingerprint =
    symbol || '|' ||
    timeframe || '|' ||
    signal_type || '|' ||
    printf('%.12g', entry_price) || '|' ||
    printf('%.12g', stop_loss) || '|' ||
    printf('%.12g', take_profit) || '|' ||
    strategy_version;

DELETE FROM sp2l_signals
WHERE id NOT IN (
    SELECT MAX(id)
    FROM sp2l_signals
    GROUP BY fingerprint
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sp2l_signals_fingerprint
ON sp2l_signals(fingerprint);
