import type { Customer } from "../entities/Customer";
import type { CustomerAddress } from "../entities/CustomerAddress";

export interface CustomerRepository {
    findById(customerId: string): Promise<Customer | null>;
    findByPhone(phone: string): Promise<Customer | null>;
    save(customer: Customer): Promise<void>;
    listAddresses(customerId: string): Promise<CustomerAddress[]>;
    saveAddress(address: CustomerAddress): Promise<void>;
    deleteAddress(customerId: string, addressId: string): Promise<void>;
}
