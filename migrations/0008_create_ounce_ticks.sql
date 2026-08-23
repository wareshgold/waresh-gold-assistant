CREATE TABLE IF NOT EXISTS ounce_ticks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    price REAL NOT NULL,
    direction TEXT,
    raw_message TEXT,
    timestamp INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ounce_ticks_timestamp
ON ounce_ticks(timestamp DESC);