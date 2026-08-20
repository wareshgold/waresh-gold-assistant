CREATE TABLE IF NOT EXISTS vip_codes (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    feature TEXT NOT NULL,
    max_users INTEGER NOT NULL,
    used_count INTEGER NOT NULL DEFAULT 0,
    expires_at INTEGER,
    created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_vip_codes_code
ON vip_codes(code);

CREATE TABLE IF NOT EXISTS user_vip_access (
    id TEXT PRIMARY KEY,
    telegram_user_id TEXT NOT NULL,
    feature TEXT NOT NULL,
    activated_at INTEGER NOT NULL,
    expires_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_user_vip_access_user_feature
ON user_vip_access(telegram_user_id, feature);

CREATE TABLE IF NOT EXISTS sp2l_signals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT NOT NULL,
    timeframe TEXT NOT NULL,
    signal_type TEXT NOT NULL,
    entry_price REAL NOT NULL,
    stop_loss REAL NOT NULL,
    take_profit REAL NOT NULL,
    risk_reward REAL NOT NULL,
    confidence REAL NOT NULL,
    strategy_version TEXT NOT NULL,
    generated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sp2l_signals_symbol_generated
ON sp2l_signals(symbol, generated_at DESC);