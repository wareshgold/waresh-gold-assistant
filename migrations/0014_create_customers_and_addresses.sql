CREATE TABLE IF NOT EXISTS customers (
    customer_id TEXT PRIMARY KEY,
    phone TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL DEFAULT '',
    last_name TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS customer_addresses (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    title TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    province TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id
ON customer_addresses(customer_id);
