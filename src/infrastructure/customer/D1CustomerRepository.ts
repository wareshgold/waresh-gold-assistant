import type { Customer } from "../../domain/customer/entities/Customer";
import type { CustomerAddress } from "../../domain/customer/entities/CustomerAddress";
import type { CustomerRepository } from "../../domain/customer/repositories/CustomerRepository";

type CustomerRow = {
    customer_id: string;
    username: string;
    phone: string;
    national_id: string;
    first_name: string;
    last_name: string;
    password_hash: string;
    password_salt: string;
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
    is_default: number;
    created_at: string;
    updated_at: string;
};

const CUSTOMER_COLUMNS = `customer_id, username, phone, national_id, first_name, last_name, password_hash, password_salt, created_at, updated_at`;

const mapCustomer = (row: CustomerRow): Customer => ({
    customerId: row.customer_id,
    username: row.username,
    phone: row.phone,
    nationalId: row.national_id,
    firstName: row.first_name,
    lastName: row.last_name,
    passwordHash: row.password_hash,
    passwordSalt: row.password_salt,
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
    isDefault: row.is_default === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

export class D1CustomerRepository implements CustomerRepository {
    constructor(private readonly db: D1Database) {}

    async findById(customerId: string): Promise<Customer | null> {
        const row = await this.db.prepare(`SELECT ${CUSTOMER_COLUMNS} FROM customers WHERE customer_id = ?`).bind(customerId).first<CustomerRow>();
        return row ? mapCustomer(row) : null;
    }

    async findByPhone(phone: string): Promise<Customer | null> {
        const row = await this.db.prepare(`SELECT ${CUSTOMER_COLUMNS} FROM customers WHERE phone = ?`).bind(phone).first<CustomerRow>();
        return row ? mapCustomer(row) : null;
    }

    async findByUsername(username: string): Promise<Customer | null> {
        const row = await this.db.prepare(`SELECT ${CUSTOMER_COLUMNS} FROM customers WHERE username = ?`).bind(username).first<CustomerRow>();
        return row ? mapCustomer(row) : null;
    }

    async findByNationalId(nationalId: string): Promise<Customer | null> {
        const row = await this.db.prepare(`SELECT ${CUSTOMER_COLUMNS} FROM customers WHERE national_id = ?`).bind(nationalId).first<CustomerRow>();
        return row ? mapCustomer(row) : null;
    }

    async save(customer: Customer): Promise<void> {
        await this.db.prepare(`
            INSERT INTO customers
                (customer_id, username, phone, national_id, first_name, last_name, password_hash, password_salt, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(customer_id) DO UPDATE SET
                username = excluded.username,
                phone = excluded.phone,
                national_id = excluded.national_id,
                first_name = excluded.first_name,
                last_name = excluded.last_name,
                password_hash = excluded.password_hash,
                password_salt = excluded.password_salt,
                updated_at = excluded.updated_at
        `).bind(
            customer.customerId, customer.username, customer.phone, customer.nationalId,
            customer.firstName, customer.lastName, customer.passwordHash, customer.passwordSalt,
            customer.createdAt, customer.updatedAt,
        ).run();
    }

    async listAddresses(customerId: string): Promise<CustomerAddress[]> {
        const result = await this.db.prepare(`
            SELECT id, customer_id, title, recipient_name, phone, province, city, address, postal_code, is_default, created_at, updated_at
            FROM customer_addresses WHERE customer_id = ? ORDER BY is_default DESC, created_at DESC
        `).bind(customerId).all<AddressRow>();
        return result.results.map(mapAddress);
    }

    async saveAddress(address: CustomerAddress): Promise<void> {
        const statements = [];
        if (address.isDefault) {
            statements.push(this.db.prepare("UPDATE customer_addresses SET is_default = 0 WHERE customer_id = ? AND id <> ?").bind(address.customerId, address.id));
        }
        statements.push(this.db.prepare(`
            INSERT INTO customer_addresses
                (id, customer_id, title, recipient_name, phone, province, city, address, postal_code, is_default, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET title = excluded.title, recipient_name = excluded.recipient_name,
                phone = excluded.phone, province = excluded.province, city = excluded.city, address = excluded.address,
                postal_code = excluded.postal_code, is_default = excluded.is_default, updated_at = excluded.updated_at
        `).bind(
            address.id, address.customerId, address.title, address.recipientName, address.phone,
            address.province, address.city, address.address, address.postalCode, address.isDefault ? 1 : 0,
            address.createdAt, address.updatedAt,
        ));
        await this.db.batch(statements);
    }

    async setDefaultAddress(customerId: string, addressId: string): Promise<void> {
        await this.db.batch([
            this.db.prepare("UPDATE customer_addresses SET is_default = 0 WHERE customer_id = ?").bind(customerId),
            this.db.prepare("UPDATE customer_addresses SET is_default = 1, updated_at = ? WHERE id = ? AND customer_id = ?").bind(new Date().toISOString(), addressId, customerId),
        ]);
    }

    async deleteAddress(customerId: string, addressId: string): Promise<void> {
        const existing = await this.db.prepare("SELECT is_default FROM customer_addresses WHERE id = ? AND customer_id = ?").bind(addressId, customerId).first<{ is_default: number }>();
        await this.db.prepare("DELETE FROM customer_addresses WHERE id = ? AND customer_id = ?").bind(addressId, customerId).run();
        if (existing?.is_default === 1) {
            await this.db.prepare("UPDATE customer_addresses SET is_default = 1, updated_at = ? WHERE id = (SELECT id FROM customer_addresses WHERE customer_id = ? ORDER BY created_at DESC LIMIT 1)").bind(new Date().toISOString(), customerId).run();
        }
    }
}
