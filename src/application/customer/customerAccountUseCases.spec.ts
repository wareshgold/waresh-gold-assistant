import { describe, expect, it } from "vitest";
import { AddCustomerAddressUseCase } from "./AddCustomerAddressUseCase";
import { GetCustomerAccountUseCase } from "./GetCustomerAccountUseCase";
import { RemoveCustomerAddressUseCase } from "./RemoveCustomerAddressUseCase";
import { UpdateCustomerProfileUseCase } from "./UpdateCustomerProfileUseCase";
import { MemoryCustomerRepository } from "../../infrastructure/customer/MemoryCustomerRepository";

const customer = {
    customerId: "customer-1",
    phone: "+989121234567",
    firstName: "Ali",
    lastName: "Mirzaei",
    createdAt: "2026-09-06T08:00:00.000Z",
    updatedAt: "2026-09-06T08:00:00.000Z",
};

describe("customer account use cases", () => {
    it("returns the customer account with persisted addresses", async () => {
        const repository = new MemoryCustomerRepository();
        await repository.save(customer);

        const addAddress = new AddCustomerAddressUseCase(repository);
        await addAddress.execute({
            customerId: customer.customerId,
            title: "خانه",
            recipientName: "Ali Mirzaei",
            phone: "+989121234567",
            province: "تهران",
            city: "تهران",
            address: "خیابان نمونه",
            postalCode: "1234567890",
        });

        const account = await new GetCustomerAccountUseCase(repository).execute(customer.customerId);

        expect(account?.customerId).toBe(customer.customerId);
        expect(account?.addresses).toHaveLength(1);
        expect(account?.addresses[0].title).toBe("خانه");
    });

    it("updates only the profile fields owned by the use case", async () => {
        const repository = new MemoryCustomerRepository();
        await repository.save(customer);

        const updated = await new UpdateCustomerProfileUseCase(repository).execute({
            customerId: customer.customerId,
            firstName: "  Ali  ",
            lastName: "  NewName  ",
        });

        expect(updated.firstName).toBe("Ali");
        expect(updated.lastName).toBe("NewName");
        expect(updated.phone).toBe(customer.phone);
        expect(updated.customerId).toBe(customer.customerId);
    });

    it("removes an address only when it belongs to the authenticated customer", async () => {
        const repository = new MemoryCustomerRepository();
        await repository.save(customer);

        const address = await new AddCustomerAddressUseCase(repository).execute({
            customerId: customer.customerId,
            title: "کار",
            recipientName: "Ali Mirzaei",
            phone: customer.phone,
            province: "گیلان",
            city: "رشت",
            address: "خیابان نمونه",
            postalCode: "1234567890",
        });

        await new RemoveCustomerAddressUseCase(repository).execute({
            customerId: customer.customerId,
            addressId: address.id,
        });

        const account = await new GetCustomerAccountUseCase(repository).execute(customer.customerId);
        expect(account?.addresses).toEqual([]);
    });

    it("rejects profile updates for an unknown customer", async () => {
        const repository = new MemoryCustomerRepository();

        await expect(
            new UpdateCustomerProfileUseCase(repository).execute({
                customerId: "missing",
                firstName: "Ali",
                lastName: "Mirzaei",
            }),
        ).rejects.toThrow("Customer account not found");
    });

    it("rejects address creation for an unknown customer", async () => {
        const repository = new MemoryCustomerRepository();

        await expect(
            new AddCustomerAddressUseCase(repository).execute({
                customerId: "missing",
                title: "خانه",
                recipientName: "Ali Mirzaei",
                phone: customer.phone,
                province: "تهران",
                city: "تهران",
                address: "خیابان نمونه",
                postalCode: "1234567890",
            }),
        ).rejects.toThrow("Customer account not found");
    });
});
