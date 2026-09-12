ALTER TABLE customer_addresses ADD COLUMN is_default INTEGER NOT NULL DEFAULT 0;

UPDATE customer_addresses
SET is_default = 1
WHERE id IN (
    SELECT candidate.id
    FROM customer_addresses AS candidate
    WHERE candidate.id = (
        SELECT first.id
        FROM customer_addresses AS first
        WHERE first.customer_id = candidate.customer_id
        ORDER BY first.created_at ASC, first.id ASC
        LIMIT 1
    )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_addresses_one_default
ON customer_addresses(customer_id)
WHERE is_default = 1;
