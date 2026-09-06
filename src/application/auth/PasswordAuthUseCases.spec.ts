import { describe, expect, it } from "vitest";
import { LoginCustomerUseCase } from "./LoginCustomerUseCase";
import { RegisterCustomerUseCase } from "./RegisterCustomerUseCase";
import { MemoryCustomerRepository } from "../../infrastructure/customer/MemoryCustomerRepository";
import { MemorySessionService } from "../../infrastructure/auth/MemorySessionService";
import type { PasswordHasher } from "../../domain/auth/providers/PasswordHasher";

const fakeHasher: PasswordHasher = {
    async hash(password) { return { hash: `hash:${password}`, salt: "salt" }; },
    async verify(password, hash, salt) { return salt === "salt" && hash === `hash:${password}`; },
};

describe("password customer authentication", () => {
    it("registers a customer and creates a session", async () => {
        const customers = new MemoryCustomerRepository();
        const sessions = new MemorySessionService();
        const result = await new RegisterCustomerUseCase(customers, sessions, fakeHasher).execute({
            username: "Ali_Gold",
            password: "strongpass123",
            phone: "+989121234567",
            nationalId: "0012345678",
            firstName: "Ali",
            lastName: "Mirzaei",
        });

        expect(result.username).toBe("ali_gold");
        expect(result.customerId).toBeTruthy();
        expect(result.session.customerId).toBe(result.customerId);
        expect((await customers.findByUsername("ali_gold"))?.nationalId).toBe("0012345678");
    });

    it("logs in with a valid password and rejects an invalid one", async () => {
        const customers = new MemoryCustomerRepository();
        const sessions = new MemorySessionService();
        const register = new RegisterCustomerUseCase(customers, sessions, fakeHasher);
        await register.execute({ username: "ali_gold", password: "strongpass123", phone: "+989121234567", nationalId: "0012345678" });

        const login = new LoginCustomerUseCase(customers, sessions, fakeHasher);
        const result = await login.execute("ALI_GOLD", "strongpass123");
        expect(result.session.customerId).toBe(result.customerId);
        await expect(login.execute("ali_gold", "wrongpass")).rejects.toThrow("نام کاربری یا رمز عبور نادرست است.");
    });

    it("rejects duplicate username, phone and national id", async () => {
        const customers = new MemoryCustomerRepository();
        const sessions = new MemorySessionService();
        const register = new RegisterCustomerUseCase(customers, sessions, fakeHasher);
        await register.execute({ username: "ali_gold", password: "strongpass123", phone: "+989121234567", nationalId: "0012345678" });

        await expect(register.execute({ username: "ali_gold", password: "strongpass123", phone: "+989121234568", nationalId: "0012345679" })).rejects.toThrow("نام کاربری قبلاً ثبت شده است.");
        await expect(register.execute({ username: "ali_gold2", password: "strongpass123", phone: "+989121234567", nationalId: "0012345679" })).rejects.toThrow("این شماره موبایل قبلاً ثبت شده است.");
        await expect(register.execute({ username: "ali_gold3", password: "strongpass123", phone: "+989121234568", nationalId: "0012345678" })).rejects.toThrow("این کد ملی قبلاً ثبت شده است.");
    });
});
