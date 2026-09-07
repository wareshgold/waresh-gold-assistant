CREATE TABLE IF NOT EXISTS orders (
    order_id TEXT PRIMARY KEY,
    quote_id TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    gold18_price REAL NOT NULL,
    currency_price REAL NOT NULL,
    ounce_price REAL,
    market_updated_at TEXT NOT NULL,
    total REAL NOT NULL,
    FOREIGN KEY (quote_id) REFERENCES order_quotes(quote_id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    variant_id TEXT NOT NULL,
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    weight_grams REAL NOT NULL,
    unit_price REAL NOT NULL,
    line_total REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id
ON order_items(order_id);

CREATE INDEX IF NOT EXISTS idx_orders_quote_id
ON orders(quote_id);
