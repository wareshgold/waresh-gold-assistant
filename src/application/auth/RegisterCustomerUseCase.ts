import type { PasswordHasher } from "../../domain/auth/providers/PasswordHasher";
import type { SessionService, CustomerSession } from "../../domain/auth/providers/SessionService";
import type { Customer } from "../../domain/customer/entities/Customer";
import type { CustomerRepository } from "../../domain/customer/repositories/CustomerRepository";

export type RegisterCustomerInput = {
    username: string;
    password: string;
    phone: string;
    nationalId: string;
    firstName?: string;
    lastName?: string;
};

export type AuthenticatedPasswordCustomer = {
    customerId: string;
    username: string;
    phone: string;
    nationalId: string;
    firstName: string;
    lastName: string;
    session: CustomerSession;
};

const normalize = (value: string) => value.trim();

export class RegisterCustomerUseCase {
    constructor(
        private readonly customers: CustomerRepository,
        private readonly sessions: SessionService,
        private readonly passwordHasher: PasswordHasher,
    ) {}

    async execute(input: RegisterCustomerInput): Promise<AuthenticatedPasswordCustomer> {
        const username = normalize(input.username).toLowerCase();
        const password = input.password;
        const phone = normalize(input.phone);
        const nationalId = normalize(input.nationalId);

        if (!/^[a-z0-9_]{3,32}$/.test(username)) throw new Error("نام کاربری معتبر نیست.");
        if (password.length < 8 || password.length > 128) throw new Error("رمز عبور باید حداقل ۸ کاراکتر باشد.");
        if (!/^\+989\d{9}$/.test(phone)) throw new Error("شماره موبایل معتبر نیست.");
        if (!/^\d{10}$/.test(nationalId)) throw new Error("کد ملی معتبر نیست.");
        if (await this.customers.findByUsername(username)) throw new Error("نام کاربری قبلاً ثبت شده است.");
        if (await this.customers.findByPhone(phone)) throw new Error("این شماره موبایل قبلاً ثبت شده است.");
        if (await this.customers.findByNationalId(nationalId)) throw new Error("این کد ملی قبلاً ثبت شده است.");

        const now = new Date().toISOString();
        const credentials = await this.passwordHasher.hash(password);
        const customer: Customer = {
            customerId: crypto.randomUUID(),
            username,
            phone,
            nationalId,
            firstName: normalize(input.firstName ?? ""),
            lastName: normalize(input.lastName ?? ""),
            passwordHash: credentials.hash,
            passwordSalt: credentials.salt,
            createdAt: now,
            updatedAt: now,
        };

        await this.customers.save(customer);
        const session = await this.sessions.create(customer.customerId);
        return { ...customer, session };
    }
}
