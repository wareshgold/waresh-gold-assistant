CREATE TABLE IF NOT EXISTS telegram_sessions (

    user_id TEXT PRIMARY KEY,

    state TEXT NOT NULL,

    data TEXT NOT NULL,

    updated_at INTEGER NOT NULL

);