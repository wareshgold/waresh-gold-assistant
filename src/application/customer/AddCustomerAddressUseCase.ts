import type { CustomerAddress } from "../../domain/customer/entities/CustomerAddress";
import type { CustomerRepository } from "../../domain/customer/repositories/CustomerRepository";

export type AddCustomerAddressInput = {
    customerId: string;
    title: string;
    recipientName: string;
    phone: string;
    province: string;
    city: string;
    address: string;
    postalCode: string;
};

export class AddCustomerAddressUseCase {
    constructor(private readonly customerRepository: CustomerRepository) {}

    async execute(input: AddCustomerAddressInput): Promise<CustomerAddress> {
        const customer = await this.customerRepository.findById(input.customerId);
        if (!customer) {
            throw new Error("Customer account not found");
        }

        const now = new Date().toISOString();
        const address: CustomerAddress = {
            id: crypto.randomUUID(),
            customerId: input.customerId,
            title: input.title.trim(),
            recipientName: input.recipientName.trim(),
            phone: input.phone.trim(),
            province: input.province.trim(),
            city: input.city.trim(),
            address: input.address.trim(),
            postalCode: input.postalCode.trim(),
            createdAt: now,
            updatedAt: now,
        };

        await this.customerRepository.saveAddress(address);
        return address;
    }
}
