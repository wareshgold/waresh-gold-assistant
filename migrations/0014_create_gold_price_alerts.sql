CREATE TABLE IF NOT EXISTS gold_price_alerts (
    user_id TEXT PRIMARY KEY,
    interval_hours INTEGER NOT NULL CHECK (interval_hours IN (1, 6, 12)),
    enabled INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0, 1)),
    last_notified_at TEXT NULL,
    claim_until TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_gold_price_alerts_due
ON gold_price_alerts(enabled, claim_until, last_notified_at, interval_hours);
