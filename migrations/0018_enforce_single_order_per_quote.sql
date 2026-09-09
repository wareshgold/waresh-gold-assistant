CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_quote_id_unique
ON orders(quote_id);
