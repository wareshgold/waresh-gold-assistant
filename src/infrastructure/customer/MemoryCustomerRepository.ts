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
        return [...this.addresses.values()].filter((address) => address.customerId === customerId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    async saveAddress(address: CustomerAddress): Promise<void> { this.addresses.set(address.id, address); }

    async deleteAddress(customerId: string, addressId: string): Promise<void> {
        const address = this.addresses.get(addressId);
        if (address?.customerId === customerId) this.addresses.delete(addressId);
    }
}
