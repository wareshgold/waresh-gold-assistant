CREATE TABLE IF NOT EXISTS gold_calculation_history (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id TEXT NOT NULL,

    weight REAL NOT NULL,

    gold_price INTEGER NOT NULL,

    labor_percent REAL NOT NULL,

    profit_percent REAL NOT NULL,

    tax_percent REAL NOT NULL,

    discount REAL NOT NULL,

    gold_value INTEGER NOT NULL,

    labor INTEGER NOT NULL,

    profit INTEGER NOT NULL,

    tax INTEGER NOT NULL,

    final_price INTEGER NOT NULL,

    created_at INTEGER NOT NULL

);



CREATE INDEX IF NOT EXISTS idx_gold_calculation_history_user_id

ON gold_calculation_history(user_id);



CREATE INDEX IF NOT EXISTS idx_gold_calculation_history_created_at

ON gold_calculation_history(created_at DESC);