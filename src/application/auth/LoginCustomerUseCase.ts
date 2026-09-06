import type { PasswordHasher } from "../../domain/auth/providers/PasswordHasher";
import type { SessionService } from "../../domain/auth/providers/SessionService";
import type { CustomerRepository } from "../../domain/customer/repositories/CustomerRepository";
import type { AuthenticatedPasswordCustomer } from "./RegisterCustomerUseCase";

export class LoginCustomerUseCase {
    constructor(
        private readonly customers: CustomerRepository,
        private readonly sessions: SessionService,
        private readonly passwordHasher: PasswordHasher,
    ) {}

    async execute(username: string, password: string): Promise<AuthenticatedPasswordCustomer> {
        const normalizedUsername = username.trim().toLowerCase();
        const customer = await this.customers.findByUsername(normalizedUsername);
        if (!customer || !customer.passwordHash || !customer.passwordSalt) throw new Error("نام کاربری یا رمز عبور نادرست است.");

        const valid = await this.passwordHasher.verify(password, customer.passwordHash, customer.passwordSalt);
        if (!valid) throw new Error("نام کاربری یا رمز عبور نادرست است.");

        const session = await this.sessions.create(customer.customerId);
        return { ...customer, session };
    }
}
