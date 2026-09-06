import type { Customer } from "../../domain/customer/entities/Customer";
import type { CustomerRepository } from "../../domain/customer/repositories/CustomerRepository";

export type UpdateCustomerProfileInput = {
    customerId: string;
    firstName: string;
    lastName: string;
};

export class UpdateCustomerProfileUseCase {
    constructor(private readonly customerRepository: CustomerRepository) {}

    async execute(input: UpdateCustomerProfileInput): Promise<Customer> {
        const current = await this.customerRepository.findById(input.customerId);
        if (!current) {
            throw new Error("Customer account not found");
        }

        const updated: Customer = {
            ...current,
            firstName: input.firstName.trim(),
            lastName: input.lastName.trim(),
            updatedAt: new Date().toISOString(),
        };

        await this.customerRepository.save(updated);
        return updated;
    }
}
