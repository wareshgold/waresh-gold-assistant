ALTER TABLE customers ADD COLUMN customer_number TEXT;

UPDATE customers
SET customer_number = 'WG-' || upper(substr(replace(customer_id, '-', ''), 1, 12))
WHERE customer_number IS NULL OR customer_number = '';

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_customer_number
ON customers(customer_number);
