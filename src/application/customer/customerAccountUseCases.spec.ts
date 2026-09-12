import { describe, expect, it } from "vitest";
import { AddCustomerAddressUseCase } from "./AddCustomerAddressUseCase";
import { GetCustomerAccountUseCase } from "./GetCustomerAccountUseCase";
import { RemoveCustomerAddressUseCase } from "./RemoveCustomerAddressUseCase";
import { UpdateCustomerProfileUseCase } from "./UpdateCustomerProfileUseCase";
import { MemoryCustomerRepository } from "../../infrastructure/customer/MemoryCustomerRepository";

const customer = {
    customerId: "customer-1",
    username: "ali_gold",
    phone: "+989121234567",
    nationalId: "0012345678",
    firstName: "Ali",
    lastName: "Mirzaei",
    passwordHash: "",
    passwordSalt: "",
    createdAt: "2026-09-06T08:00:00.000Z",
    updatedAt: "2026-09-06T08:00:00.000Z",
};

describe("customer account use cases", () => {
    it("returns the customer account with persisted addresses", async () => {
        const repository = new MemoryCustomerRepository();
        await repository.save(customer);

        const addAddress = new AddCustomerAddressUseCase(repository);
        await addAddress.execute({ customerId: customer.customerId, title: "خانه", recipientName: "Ali Mirzaei", phone: "+989121234567", province: "تهران", city: "تهران", address: "خیابان نمونه", postalCode: "1234567890" });
        const account = await new GetCustomerAccountUseCase(repository).execute(customer.customerId);

        expect(account?.customerId).toBe(customer.customerId);
        expect(account?.addresses).toHaveLength(1);
        expect(account?.addresses[0].title).toBe("خانه");
    });

    it("updates a persisted address without changing its identity", async () => {
        const repository = new MemoryCustomerRepository();
        await repository.save(customer);
        const addAddress = new AddCustomerAddressUseCase(repository);
        const address = await addAddress.execute({ customerId: customer.customerId, title: "خانه", recipientName: "Ali Mirzaei", phone: customer.phone, province: "تهران", city: "تهران", address: "خیابان قدیم", postalCode: "1234567890" });

        const updated = await addAddress.execute({ customerId: customer.customerId, addressId: address.id, title: "خانه جدید", recipientName: "Ali Mirzaei", phone: customer.phone, province: "گیلان", city: "رشت", address: "خیابان جدید", postalCode: "0987654321" });
        const account = await new GetCustomerAccountUseCase(repository).execute(customer.customerId);

        expect(updated.id).toBe(address.id);
        expect(updated.createdAt).toBe(address.createdAt);
        expect(updated.updatedAt).not.toBe(address.updatedAt);
        expect(account?.addresses).toHaveLength(1);
        expect(account?.addresses[0]).toMatchObject({ id: address.id, title: "خانه جدید", province: "گیلان", city: "رشت", address: "خیابان جدید", postalCode: "0987654321" });
    });

    it("rejects updates for an address owned by another customer", async () => {
        const repository = new MemoryCustomerRepository();
        await repository.save(customer);
        const otherCustomer = { ...customer, customerId: "customer-2", username: "other_gold", phone: "+989121234568", nationalId: "0012345679" };
        await repository.save(otherCustomer);
        const address = await new AddCustomerAddressUseCase(repository).execute({ customerId: otherCustomer.customerId, title: "خانه", recipientName: "Other", phone: otherCustomer.phone, province: "تهران", city: "تهران", address: "خیابان نمونه", postalCode: "1234567890" });

        await expect(new AddCustomerAddressUseCase(repository).execute({ customerId: customer.customerId, addressId: address.id, title: "تلاش", recipientName: "Ali Mirzaei", phone: customer.phone, province: "تهران", city: "تهران", address: "نباید تغییر کند", postalCode: "1234567890" })).rejects.toThrow("Customer address not found");
    });

    it("updates only the profile fields owned by the use case", async () => {
        const repository = new MemoryCustomerRepository();
        await repository.save(customer);
        const updated = await new UpdateCustomerProfileUseCase(repository).execute({ customerId: customer.customerId, firstName: "  Ali  ", lastName: "  NewName  " });
        expect(updated.firstName).toBe("Ali");
        expect(updated.lastName).toBe("NewName");
        expect(updated.phone).toBe(customer.phone);
        expect(updated.customerId).toBe(customer.customerId);
    });

    it("removes an address only when it belongs to the authenticated customer", async () => {
        const repository = new MemoryCustomerRepository();
        await repository.save(customer);
        const address = await new AddCustomerAddressUseCase(repository).execute({ customerId: customer.customerId, title: "کار", recipientName: "Ali Mirzaei", phone: customer.phone, province: "گیلان", city: "رشت", address: "خیابان نمونه", postalCode: "1234567890" });
        await new RemoveCustomerAddressUseCase(repository).execute({ customerId: customer.customerId, addressId: address.id });
        const account = await new GetCustomerAccountUseCase(repository).execute(customer.customerId);
        expect(account?.addresses).toEqual([]);
    });

    it("rejects profile updates for an unknown customer", async () => {
        const repository = new MemoryCustomerRepository();
        await expect(new UpdateCustomerProfileUseCase(repository).execute({ customerId: "missing", firstName: "Ali", lastName: "Mirzaei" })).rejects.toThrow("Customer account not found");
    });

    it("rejects address creation for an unknown customer", async () => {
        const repository = new MemoryCustomerRepository();
        await expect(new AddCustomerAddressUseCase(repository).execute({ customerId: "missing", title: "خانه", recipientName: "Ali Mirzaei", phone: customer.phone, province: "تهران", city: "تهران", address: "خیابان نمونه", postalCode: "1234567890" })).rejects.toThrow("Customer account not found");
    });
});
