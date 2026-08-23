CREATE TABLE IF NOT EXISTS telegram_webhook_rate_limits (
    rate_limit_key TEXT NOT NULL,
    window_seconds INTEGER NOT NULL,
    window_started_at INTEGER NOT NULL,
    request_count INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (rate_limit_key, window_seconds)
);

CREATE TABLE IF NOT EXISTS telegram_webhook_update_checkpoints (
    checkpoint_key TEXT PRIMARY KEY,
    last_update_id INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
