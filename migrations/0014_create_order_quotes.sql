CREATE TABLE IF NOT EXISTS order_quotes (
    quote_id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    gold18_price REAL NOT NULL,
    currency_price REAL NOT NULL,
    ounce_price REAL,
    market_updated_at TEXT NOT NULL,
    total REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS order_quote_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    variant_id TEXT NOT NULL,
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    weight_grams REAL NOT NULL,
    unit_price REAL NOT NULL,
    line_total REAL NOT NULL,
    FOREIGN KEY (quote_id) REFERENCES order_quotes(quote_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_order_quote_items_quote_id
ON order_quote_items(quote_id);
