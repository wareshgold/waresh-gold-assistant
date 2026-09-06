import type { CustomerSession, SessionService } from "../../domain/auth/providers/SessionService";

export class CreateCustomerSessionUseCase {
    constructor(private readonly sessionService: SessionService) {}

    async execute(customerId: string): Promise<CustomerSession> {
        if (!customerId.trim()) {
            throw new Error("Customer id is required");
        }

        return this.sessionService.create(customerId);
    }
}
