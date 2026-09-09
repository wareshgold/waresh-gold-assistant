CREATE TABLE payments_v2 (
    payment_id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    amount INTEGER NOT NULL CHECK (amount > 0),
    status TEXT NOT NULL CHECK (status IN ('pending', 'initiated', 'paid', 'failed', 'cancelled', 'expired', 'refunded')),
    gateway TEXT NOT NULL,
    authority TEXT,
    reference_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

INSERT INTO payments_v2 (
    payment_id,
    order_id,
    amount,
    status,
    gateway,
    authority,
    reference_id,
    created_at,
    updated_at
)
SELECT
    payment_id,
    order_id,
    amount,
    status,
    gateway,
    authority,
    reference_id,
    created_at,
    updated_at
FROM payments;

DROP TABLE payments;
ALTER TABLE payments_v2 RENAME TO payments;

CREATE INDEX IF NOT EXISTS idx_payments_order_created_at
ON payments(order_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payments_status_created_at
ON payments(status, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_one_active_per_order
ON payments(order_id)
WHERE status IN ('pending', 'initiated');
