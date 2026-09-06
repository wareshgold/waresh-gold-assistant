import type { Customer } from "../../domain/customer/entities/Customer";
import type { CustomerAddress } from "../../domain/customer/entities/CustomerAddress";
import type { CustomerRepository } from "../../domain/customer/repositories/CustomerRepository";

export type CustomerAccount = Customer & {
    addresses: CustomerAddress[];
};

export class GetCustomerAccountUseCase {
    constructor(private readonly customerRepository: CustomerRepository) {}

    async execute(customerId: string): Promise<CustomerAccount | null> {
        const customer = await this.customerRepository.findById(customerId);
        if (!customer) return null;

        const addresses = await this.customerRepository.listAddresses(customerId);
        return { ...customer, addresses };
    }
}
