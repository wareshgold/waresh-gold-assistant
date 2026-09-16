CREATE TABLE IF NOT EXISTS order_status_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    from_status TEXT,
    to_status TEXT NOT NULL,
    changed_at TEXT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id
    ON order_status_history(order_id, id);

CREATE TRIGGER IF NOT EXISTS trg_orders_status_history
AFTER UPDATE OF status ON orders
WHEN OLD.status <> NEW.status
BEGIN
    INSERT INTO order_status_history (order_id, from_status, to_status, changed_at)
    VALUES (NEW.order_id, OLD.status, NEW.status, NEW.updated_at);
END;
