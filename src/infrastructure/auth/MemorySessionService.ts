import type {
    CustomerSession,
    SessionService,
} from "../../domain/auth/providers/SessionService";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export class MemorySessionService implements SessionService {
    private readonly sessions = new Map<string, CustomerSession>();

    async create(customerId: string): Promise<CustomerSession> {
        const session: CustomerSession = {
            sessionId: crypto.randomUUID(),
            customerId,
            expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
        };

        this.sessions.set(session.sessionId, session);
        return session;
    }

    async get(sessionId: string): Promise<CustomerSession | null> {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        if (new Date(session.expiresAt).getTime() <= Date.now()) {
            this.sessions.delete(sessionId);
            return null;
        }

        return session;
    }

    async revoke(sessionId: string): Promise<void> {
        this.sessions.delete(sessionId);
    }
}
