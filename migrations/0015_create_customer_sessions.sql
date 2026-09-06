CREATE TABLE IF NOT EXISTS customer_sessions (
    session_id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    revoked_at TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_customer_sessions_customer_id
ON customer_sessions(customer_id);

CREATE INDEX IF NOT EXISTS idx_customer_sessions_expires_at
ON customer_sessions(expires_at);
