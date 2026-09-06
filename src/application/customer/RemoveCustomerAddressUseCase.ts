import type { CustomerRepository } from "../../domain/customer/repositories/CustomerRepository";

export type RemoveCustomerAddressInput = {
    customerId: string;
    addressId: string;
};

export class RemoveCustomerAddressUseCase {
    constructor(private readonly customerRepository: CustomerRepository) {}

    async execute(input: RemoveCustomerAddressInput): Promise<void> {
        const customer = await this.customerRepository.findById(input.customerId);
        if (!customer) {
            throw new Error("Customer account not found");
        }

        const addresses = await this.customerRepository.listAddresses(input.customerId);
        const address = addresses.find((item) => item.id === input.addressId);
        if (!address) {
            throw new Error("Customer address not found");
        }

        await this.customerRepository.deleteAddress(input.customerId, input.addressId);
    }
}
