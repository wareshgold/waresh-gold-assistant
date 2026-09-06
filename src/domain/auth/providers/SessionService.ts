export type CustomerSession = {
    sessionId: string;
    customerId: string;
    expiresAt: string;
};

export interface SessionService {
    create(customerId: string): Promise<CustomerSession>;
    get(sessionId: string): Promise<CustomerSession | null>;
    revoke(sessionId: string): Promise<void>;
}
