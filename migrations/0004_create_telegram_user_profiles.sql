CREATE TABLE IF NOT EXISTS telegram_user_profiles (

    user_id TEXT PRIMARY KEY,

    username TEXT,

    first_name TEXT,

    created_at INTEGER NOT NULL,

    last_seen_at INTEGER NOT NULL

);