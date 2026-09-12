import type { CustomerAddress } from "../../domain/customer/entities/CustomerAddress";
import type { CustomerRepository } from "../../domain/customer/repositories/CustomerRepository";

export type AddCustomerAddressInput = {
    customerId: string;
    addressId?: string;
    title: string;
    recipientName: string;
    phone: string;
    province: string;
    city: string;
    address: string;
    postalCode: string;
    isDefault?: boolean;
};

export class AddCustomerAddressUseCase {
    constructor(private readonly customerRepository: CustomerRepository) {}

    async execute(input: AddCustomerAddressInput): Promise<CustomerAddress> {
        const customer = await this.customerRepository.findById(input.customerId);
        if (!customer) {
            throw new Error("Customer account not found");
        }

        const now = new Date().toISOString();
        const title = input.title.trim();
        const recipientName = input.recipientName.trim();
        const phone = input.phone.trim();
        const province = input.province.trim();
        const city = input.city.trim();
        const addressText = input.address.trim();
        const postalCode = input.postalCode.trim();

        if (!title || !recipientName || !phone || !province || !city || !addressText || !postalCode) {
            throw new Error("اطلاعات آدرس کامل نیست.");
        }

        const addresses = await this.customerRepository.listAddresses(input.customerId);

        if (input.addressId?.trim()) {
            const existing = addresses.find((candidate) => candidate.id === input.addressId?.trim());
            if (!existing) throw new Error("Customer address not found");

            const updated: CustomerAddress = {
                ...existing,
                title,
                recipientName,
                phone,
                province,
                city,
                address: addressText,
                postalCode,
                isDefault: input.isDefault === true ? true : existing.isDefault,
                updatedAt: now,
            };

            await this.customerRepository.saveAddress(updated);
            return updated;
        }

        const created: CustomerAddress = {
            id: crypto.randomUUID(),
            customerId: input.customerId,
            title,
            recipientName,
            phone,
            province,
            city,
            address: addressText,
            postalCode,
            isDefault: input.isDefault === true || addresses.length === 0,
            createdAt: now,
            updatedAt: now,
        };

        await this.customerRepository.saveAddress(created);
        return created;
    }
}
