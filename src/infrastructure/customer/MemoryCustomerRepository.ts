import type { Customer } from "../../domain/customer/entities/Customer";
import type { CustomerAddress } from "../../domain/customer/entities/CustomerAddress";
import type { CustomerRepository } from "../../domain/customer/repositories/CustomerRepository";

export class MemoryCustomerRepository implements CustomerRepository {
    private readonly customers = new Map<string, Customer>();
    private readonly addresses = new Map<string, CustomerAddress>();

    async findById(customerId: string): Promise<Customer | null> { return this.customers.get(customerId) ?? null; }

    async findByPhone(phone: string): Promise<Customer | null> {
        return [...this.customers.values()].find((customer) => customer.phone === phone) ?? null;
    }

    async findByUsername(username: string): Promise<Customer | null> {
        return [...this.customers.values()].find((customer) => customer.username === username) ?? null;
    }

    async findByNationalId(nationalId: string): Promise<Customer | null> {
        return [...this.customers.values()].find((customer) => customer.nationalId === nationalId) ?? null;
    }

    async save(customer: Customer): Promise<void> { this.customers.set(customer.customerId, customer); }

    async listAddresses(customerId: string): Promise<CustomerAddress[]> {
        return [...this.addresses.values()]
            .filter((address) => address.customerId === customerId)
            .sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || b.createdAt.localeCompare(a.createdAt));
    }

    async saveAddress(address: CustomerAddress): Promise<void> {
        if (address.isDefault) {
            for (const current of this.addresses.values()) {
                if (current.customerId === address.customerId && current.id !== address.id) {
                    this.addresses.set(current.id, { ...current, isDefault: false });
                }
            }
        }
        this.addresses.set(address.id, address);
    }

    async setDefaultAddress(customerId: string, addressId: string): Promise<void> {
        for (const address of this.addresses.values()) {
            if (address.customerId === customerId) {
                this.addresses.set(address.id, { ...address, isDefault: address.id === addressId, updatedAt: new Date().toISOString() });
            }
        }
    }

    async deleteAddress(customerId: string, addressId: string): Promise<void> {
        const address = this.addresses.get(addressId);
        if (address?.customerId !== customerId) return;
        this.addresses.delete(addressId);
        if (address.isDefault) {
            const replacement = [...this.addresses.values()]
                .filter((candidate) => candidate.customerId === customerId)
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
            if (replacement) this.addresses.set(replacement.id, { ...replacement, isDefault: true, updatedAt: new Date().toISOString() });
        }
    }
}
