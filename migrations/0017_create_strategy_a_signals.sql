-- Ensure Strategy A signals table exists with a valid SQLite identifier
CREATE TABLE IF NOT EXISTS strategy_a_signals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT NOT NULL,
    timeframe TEXT NOT NULL,
    signal_type TEXT NOT NULL,
    entry_price REAL NOT NULL,
    stop_loss REAL NOT NULL,
    take_profit REAL NOT NULL,
    risk_reward REAL NOT NULL,
    confidence REAL NOT NULL,
    reason TEXT NOT NULL DEFAULT '',
    strategy_version TEXT NOT NULL,
    generated_at INTEGER NOT NULL,
    fingerprint TEXT
);

CREATE INDEX IF NOT EXISTS idx_strategy_a_signals_symbol_generated
ON strategy_a_signals(symbol, generated_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_strategy_a_signals_fingerprint
ON strategy_a_signals(fingerprint);
