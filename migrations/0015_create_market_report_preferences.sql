CREATE TABLE IF NOT EXISTS market_report_preferences (
    user_id TEXT PRIMARY KEY,
    interval_hours INTEGER NOT NULL CHECK (interval_hours IN (1, 6, 12)),
    enabled INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0, 1)),
    last_reported_at TEXT,
    claim_until TEXT
);

CREATE INDEX IF NOT EXISTS idx_market_report_preferences_due
ON market_report_preferences (enabled, last_reported_at, claim_until);
