CREATE TABLE IF NOT EXISTS payments (
    payment_id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL UNIQUE,
    amount INTEGER NOT NULL CHECK (amount > 0),
    status TEXT NOT NULL CHECK (status IN ('pending', 'initiated', 'paid', 'failed', 'cancelled', 'expired', 'refunded')),
    gateway TEXT NOT NULL,
    authority TEXT,
    reference_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE INDEX IF NOT EXISTS idx_payments_status_created_at
ON payments(status, created_at DESC);
