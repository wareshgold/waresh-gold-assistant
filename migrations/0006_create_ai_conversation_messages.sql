CREATE TABLE IF NOT EXISTS ai_conversation_messages (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id TEXT NOT NULL,

    role TEXT NOT NULL
        CHECK (role IN ('user', 'assistant')),

    content TEXT NOT NULL,

    created_at INTEGER NOT NULL

);


CREATE INDEX IF NOT EXISTS idx_ai_conversation_messages_user_created_at

ON ai_conversation_messages(

    user_id,

    created_at DESC

);