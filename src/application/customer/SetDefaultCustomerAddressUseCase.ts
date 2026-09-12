import type { CustomerRepository } from "../../domain/customer/repositories/CustomerRepository";
import type { CustomerAddress } from "../../domain/customer/entities/CustomerAddress";

export type SetDefaultCustomerAddressInput = {
    customerId: string;
    addressId: string;
};

export class SetDefaultCustomerAddressUseCase {
    constructor(private readonly customerRepository: CustomerRepository) {}

    async execute(input: SetDefaultCustomerAddressInput): Promise<CustomerAddress> {
        const customer = await this.customerRepository.findById(input.customerId);
        if (!customer) throw new Error("Customer account not found");

        const addressId = input.addressId.trim();
        const addresses = await this.customerRepository.listAddresses(input.customerId);
        const address = addresses.find((candidate) => candidate.id === addressId);
        if (!address) throw new Error("Customer address not found");

        await this.customerRepository.setDefaultAddress(input.customerId, addressId);
        return { ...address, isDefault: true, updatedAt: new Date().toISOString() };
    }
}
