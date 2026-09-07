ALTER TABLE orders ADD COLUMN customer_id TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_customer_id
ON orders(customer_id);
