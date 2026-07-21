import { beforeAll } from "vitest";
import { env } from "cloudflare:test";

beforeAll(async () => {
    const migrations = [
        `
        CREATE TABLE IF NOT EXISTS market_snapshots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gold18_price INTEGER NOT NULL,
            currency_price INTEGER NOT NULL,
            ounce_price INTEGER NOT NULL,
            source TEXT NOT NULL,
            captured_at TEXT NOT NULL,
            created_at TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_market_snapshots_captured_at
        ON market_snapshots(captured_at DESC);
        `,
        `
        CREATE TABLE IF NOT EXISTS telegram_sessions (
            user_id TEXT PRIMARY KEY,
            state TEXT NOT NULL,
            data TEXT NOT NULL,
            updated_at INTEGER NOT NULL
        );
        `,
    ];

    for (const migration of migrations) {
        await env.waresh_gold_db
            .prepare(migration)
            .run();
    }
});