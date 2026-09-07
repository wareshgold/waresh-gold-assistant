ALTER TABLE orders ADD COLUMN address_id TEXT;
ALTER TABLE orders ADD COLUMN address_title TEXT;
ALTER TABLE orders ADD COLUMN address_recipient_name TEXT;
ALTER TABLE orders ADD COLUMN address_phone TEXT;
ALTER TABLE orders ADD COLUMN address_province TEXT;
ALTER TABLE orders ADD COLUMN address_city TEXT;
ALTER TABLE orders ADD COLUMN address TEXT;
ALTER TABLE orders ADD COLUMN address_postal_code TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_address_id
ON orders(address_id);
