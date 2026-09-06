import type { SessionService } from "../../domain/auth/providers/SessionService";

export class RevokeCustomerSessionUseCase {
    constructor(private readonly sessionService: SessionService) {}

    async execute(sessionId: string): Promise<void> {
        const normalized = sessionId.trim();
        if (!normalized) return;

        await this.sessionService.revoke(normalized);
    }
}
