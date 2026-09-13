import { describe, expect, it } from "vitest";
import type { Order } from "../../../domain/catalog/entities/Order";
import type { PaymentGateway } from "../../../domain/payment/gateways/PaymentGateway";
import { VerifyPaymentUseCase } from "../../../application/payment/VerifyPaymentUseCase";
import { MemoryOrderRepository } from "../../../infrastructure/catalog/MemoryOrderRepository";
import { MemoryPaymentRepository } from "../../../infrastructure/payment/MemoryPaymentRepository";
import { MemoryPaymentSettlementRepository } from "../../../infrastructure/payment/MemoryPaymentSettlementRepository";
import { verifyPaymentRoute } from "./VerifyPaymentRoute";

const order: Order = {
    orderId: "order-1",
    quoteId: "quote-1",
    customerId: "customer-1",
    address: null,
    status: "confirmed",
    createdAt: "2026-09-09T10:00:00.000Z",
    updatedAt: "2026-09-09T10:00:00.000Z",
    market: { gold18Price: 100, currencyPrice: 100, ouncePrice: null, updatedAt: "2026-09-09T10:00:00.000Z" },
    items: [],
    total: 5000000,
};

function request(body: unknown): Request {
    return new Request("https://example.test/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

async function buildFixture() {
    const paymentRepository = new MemoryPaymentRepository();
    const orderRepository = new MemoryOrderRepository();
    await orderRepository.save(order);
    await paymentRepository.save({
        paymentId: "payment-1",
        orderId: "order-1",
        amount: 5000000,
        status: "initiated",
        gateway: "test",
        authority: "AUTH-1",
        referenceId: null,
        createdAt: "2026-09-09T10:01:00.000Z",
        updatedAt: "2026-09-09T10:01:00.000Z",
    });

    let verifyCalls = 0;
    const gateway: PaymentGateway = {
        name: "test",
        async initiate() { return { authority: "AUTH-1", paymentUrl: "https://pay.test/AUTH-1" }; },
        async verify(input) {
            verifyCalls += 1;
            expect(input.amount).toBe(5000000);
            return { referenceId: "REF-1" };
        },
    };
    const settlementRepository = new MemoryPaymentSettlementRepository(paymentRepository, orderRepository);
    const useCase = new VerifyPaymentUseCase(paymentRepository, orderRepository, gateway, settlementRepository);

    return { paymentRepository, orderRepository, useCase, getVerifyCalls: () => verifyCalls };
}

describe("verifyPaymentRoute", () => {
    it("returns 200 and is idempotent after the first successful verification", async () => {
        const fixture = await buildFixture();

        const first = await verifyPaymentRoute(request({ authority: "AUTH-1" }), fixture.useCase, "payment-1");
        const second = await verifyPaymentRoute(request({ authority: "AUTH-1" }), fixture.useCase, "payment-1");
        const firstBody = await first.json() as { payment: { status: string; referenceId: string } };
        const secondBody = await second.json() as { payment: { status: string; referenceId: string } };

        expect(first.status).toBe(200);
        expect(second.status).toBe(200);
        expect(firstBody.payment.status).toBe("paid");
        expect(secondBody.payment.referenceId).toBe("REF-1");
        expect(fixture.getVerifyCalls()).toBe(1);
        expect((await fixture.orderRepository.findById("order-1"))?.status).toBe("paid");
        expect(second.headers.get("Cache-Control")).toBe("no-store");
    });

    it("returns 400 for an invalid authority without settling the payment", async () => {
        const fixture = await buildFixture();

        const response = await verifyPaymentRoute(request({ authority: "WRONG" }), fixture.useCase, "payment-1");

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: "شناسه پرداخت معتبر نیست." });
        expect(fixture.getVerifyCalls()).toBe(0);
        expect((await fixture.paymentRepository.findById("payment-1"))?.status).toBe("initiated");
    });

    it("returns 404 when the payment does not exist", async () => {
        const fixture = await buildFixture();

        const response = await verifyPaymentRoute(request({ authority: "AUTH-1" }), fixture.useCase, "missing");

        expect(response.status).toBe(404);
        expect(await response.json()).toEqual({ error: "پرداخت پیدا نشد." });
    });

    it("returns 400 when the authority is missing", async () => {
        const fixture = await buildFixture();

        const response = await verifyPaymentRoute(request({}), fixture.useCase, "payment-1");

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: "شناسه تراکنش درگاه الزامی است." });
    });
});
