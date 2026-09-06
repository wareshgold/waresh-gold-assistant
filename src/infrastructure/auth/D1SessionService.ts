import type {
    CustomerSession,
    SessionService,
} from "../../domain/auth/providers/SessionService";

type SessionRow = {
    session_id: string;
    customer_id: string;
    expires_at: string;
};

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export class D1SessionService implements SessionService {
    constructor(private readonly db: D1Database) {}

    async create(customerId: string): Promise<CustomerSession> {
        const sessionId = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
        const createdAt = new Date().toISOString();

        await this.db
            .prepare(`
                INSERT INTO customer_sessions
                    (session_id, customer_id, expires_at, created_at, revoked_at)
                VALUES (?, ?, ?, ?, NULL)
            `)
            .bind(sessionId, customerId, expiresAt, createdAt)
            .run();

        return { sessionId, customerId, expiresAt };
    }

    async get(sessionId: string): Promise<CustomerSession | null> {
        const row = await this.db
            .prepare(`
                SELECT session_id, customer_id, expires_at
                FROM customer_sessions
                WHERE session_id = ?
                  AND revoked_at IS NULL
                  AND expires_at > ?
            `)
            .bind(sessionId, new Date().toISOString())
            .first<SessionRow>();

        if (!row) return null;

        return {
            sessionId: row.session_id,
            customerId: row.customer_id,
            expiresAt: row.expires_at,
        };
    }

    async revoke(sessionId: string): Promise<void> {
        await this.db
            .prepare(`
                UPDATE customer_sessions
                SET revoked_at = ?
                WHERE session_id = ? AND revoked_at IS NULL
            `)
            .bind(new Date().toISOString(), sessionId)
            .run();
    }
}
