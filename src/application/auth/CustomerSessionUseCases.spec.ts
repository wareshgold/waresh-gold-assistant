import { describe, expect, it } from "vitest";
import { CreateCustomerSessionUseCase } from "./CreateCustomerSessionUseCase";
import { GetCustomerSessionUseCase } from "./GetCustomerSessionUseCase";
import { RevokeCustomerSessionUseCase } from "./RevokeCustomerSessionUseCase";
import { MemorySessionService } from "../../infrastructure/auth/MemorySessionService";

describe("customer session use cases", () => {
    it("creates and reads a session", async () => {
        const service = new MemorySessionService();
        const create = new CreateCustomerSessionUseCase(service);
        const get = new GetCustomerSessionUseCase(service);

        const session = await create.execute("customer-1");
        const stored = await get.execute(session.sessionId);

        expect(stored).toEqual(session);
    });

    it("revokes a session", async () => {
        const service = new MemorySessionService();
        const create = new CreateCustomerSessionUseCase(service);
        const get = new GetCustomerSessionUseCase(service);
        const revoke = new RevokeCustomerSessionUseCase(service);

        const session = await create.execute("customer-1");
        await revoke.execute(session.sessionId);

        await expect(get.execute(session.sessionId)).resolves.toBeNull();
    });

    it("rejects an empty customer id", async () => {
        const create = new CreateCustomerSessionUseCase(new MemorySessionService());

        await expect(create.execute("   ")).rejects.toThrow("Customer id is required");
    });
});
