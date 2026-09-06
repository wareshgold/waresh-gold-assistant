import type { Customer } from "../../domain/customer/entities/Customer";
import type { CustomerAddress } from "../../domain/customer/entities/CustomerAddress";
import type { CustomerRepository } from "../../domain/customer/repositories/CustomerRepository";

type CustomerRow = {
    customer_id: string;
    phone: string;
    first_name: string;
    last_name: string;
    created_at: string;
    updated_at: string;
};

type AddressRow = {
    id: string;
    customer_id: string;
    title: string;
    recipient_name: string;
    phone: string;
    province: string;
    city: string;
    address: string;
    postal_code: string;
    created_at: string;
    updated_at: string;
};

const mapCustomer = (row: CustomerRow): Customer => ({
    customerId: row.customer_id,
    phone: row.phone,
    firstName: row.first_name,
    lastName: row.last_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

const mapAddress = (row: AddressRow): CustomerAddress => ({
    id: row.id,
    customerId: row.customer_id,
    title: row.title,
    recipientName: row.recipient_name,
    phone: row.phone,
    province: row.province,
    city: row.city,
    address: row.address,
    postalCode: row.postal_code,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

export class D1CustomerRepository implements CustomerRepository {
    constructor(private readonly db: D1Database) {}

    async findById(customerId: string): Promise<Customer | null> {
        const row = await this.db
            .prepare(`
                SELECT customer_id, phone, first_name, last_name, created_at, updated_at
                FROM customers
                WHERE customer_id = ?
            `)
            .bind(customerId)
            .first<CustomerRow>();

        return row ? mapCustomer(row) : null;
    }

    async findByPhone(phone: string): Promise<Customer | null> {
        const row = await this.db
            .prepare(`
                SELECT customer_id, phone, first_name, last_name, created_at, updated_at
                FROM customers
                WHERE phone = ?
            `)
            .bind(phone)
            .first<CustomerRow>();

        return row ? mapCustomer(row) : null;
    }

    async save(customer: Customer): Promise<void> {
        await this.db
            .prepare(`
                INSERT INTO customers
                    (customer_id, phone, first_name, last_name, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(customer_id) DO UPDATE SET
                    phone = excluded.phone,
                    first_name = excluded.first_name,
                    last_name = excluded.last_name,
                    updated_at = excluded.updated_at
            `)
            .bind(
                customer.customerId,
                customer.phone,
                customer.firstName,
                customer.lastName,
                customer.createdAt,
                customer.updatedAt,
            )
            .run();
    }

    async listAddresses(customerId: string): Promise<CustomerAddress[]> {
        const result = await this.db
            .prepare(`
                SELECT id, customer_id, title, recipient_name, phone,
                       province, city, address, postal_code, created_at, updated_at
                FROM customer_addresses
                WHERE customer_id = ?
                ORDER BY created_at DESC
            `)
            .bind(customerId)
            .all<AddressRow>();

        return result.results.map(mapAddress);
    }

    async saveAddress(address: CustomerAddress): Promise<void> {
        await this.db
            .prepare(`
                INSERT INTO customer_addresses
                    (id, customer_id, title, recipient_name, phone,
                     province, city, address, postal_code, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    title = excluded.title,
                    recipient_name = excluded.recipient_name,
                    phone = excluded.phone,
                    province = excluded.province,
                    city = excluded.city,
                    address = excluded.address,
                    postal_code = excluded.postal_code,
                    updated_at = excluded.updated_at
            `)
            .bind(
                address.id,
                address.customerId,
                address.title,
                address.recipientName,
                address.phone,
                address.province,
                address.city,
                address.address,
                address.postalCode,
                address.createdAt,
                address.updatedAt,
            )
            .run();
    }

    async deleteAddress(customerId: string, addressId: string): Promise<void> {
        await this.db
            .prepare(`
                DELETE FROM customer_addresses
                WHERE id = ? AND customer_id = ?
            `)
            .bind(addressId, customerId)
            .run();
    }
}
