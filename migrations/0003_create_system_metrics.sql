CREATE TABLE IF NOT EXISTS system_metrics (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    type TEXT NOT NULL,

    value REAL NOT NULL,

    created_at TEXT NOT NULL

);


CREATE INDEX IF NOT EXISTS idx_system_metrics_created_at

ON system_metrics(created_at DESC);



CREATE INDEX IF NOT EXISTS idx_system_metrics_type

ON system_metrics(type);