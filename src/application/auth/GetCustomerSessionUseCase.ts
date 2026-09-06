import type { CustomerSession, SessionService } from "../../domain/auth/providers/SessionService";

export class GetCustomerSessionUseCase {
    constructor(private readonly sessionService: SessionService) {}

    async execute(sessionId: string): Promise<CustomerSession | null> {
        const normalized = sessionId.trim();
        if (!normalized) return null;

        return this.sessionService.get(normalized);
    }
}
