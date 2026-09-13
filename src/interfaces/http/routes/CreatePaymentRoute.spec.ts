import { describe, expect, it } from "vitest";
import type { Order } from "../../../domain/catalog/entities/Order";
import type { PaymentGateway } from "../../../domain/payment/gateways/PaymentGateway";
import { CreatePaymentUseCase } from "../../../application/payment/CreatePaymentUseCase";
import { MemoryOrderRepository } from "../../../infrastructure/catalog/MemoryOrderRepository";
import { MemoryPaymentRepository } from "../../../infrastructure/payment/MemoryPaymentRepository";
import { createPaymentRoute } from "./CreatePaymentRoute";

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
    return new Request("https://example.test/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

function buildUseCase(gateway: PaymentGateway) {
    const orderRepository = new MemoryOrderRepository();
    const paymentRepository = new MemoryPaymentRepository();
    return {
        orderRepository,
        paymentRepository,
        useCase: new CreatePaymentUseCase(orderRepository, paymentRepository, gateway, () => "payment-1"),
    };
}

describe("createPaymentRoute", () => {
    it("returns 401 when the customer session is missing", async () => {
        const gateway: PaymentGateway = {
            name: "test",
            async initiate() { throw new Error("must not be called"); },
            async verify() { throw new Error("must not be called"); },
        };
        const { useCase } = buildUseCase(gateway);

        const response = await createPaymentRoute(request({ orderId: "order-1" }), useCase, null);

        expect(response.status).toBe(401);
        expect(await response.json()).toEqual({ error: "احراز هویت لازم است." });
    });

    it("returns 400 when orderId is missing", async () => {
        const gateway: PaymentGateway = {
            name: "test",
            async initiate() { throw new Error("must not be called"); },
            async verify() { throw new Error("must not be called"); },
        };
        const { useCase } = buildUseCase(gateway);

        const response = await createPaymentRoute(request({}), useCase, "customer-1");

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: "شناسه سفارش الزامی است." });
    });

    it("returns 201 with the initiated payment and payment URL", async () => {
        const gateway: PaymentGateway = {
            name: "test",
            async initiate(input) {
                expect(input.amount).toBe(5000000);
                return { authority: "AUTH-1", paymentUrl: "https://pay.test/AUTH-1" };
            },
            async verify() { return { referenceId: "REF-1" }; },
        };
        const { orderRepository, useCase } = buildUseCase(gateway);
        await orderRepository.save(order);

        const response = await createPaymentRoute(request({ orderId: "order-1" }), useCase, "customer-1");
        const body = await response.json() as { payment: { paymentId: string; status: string }; paymentUrl: string };

        expect(response.status).toBe(201);
        expect(response.headers.get("Cache-Control")).toBe("no-store");
        expect(body.payment.paymentId).toBe("payment-1");
        expect(body.payment.status).toBe("initiated");
        expect(body.paymentUrl).toBe("https://pay.test/AUTH-1");
    });

    it("returns 403 for a payment attempt against another customer's order", async () => {
        const gateway: PaymentGateway = {
            name: "test",
            async initiate() { throw new Error("must not be called"); },
            async verify() { throw new Error("must not be called"); },
        };
        const { orderRepository, useCase } = buildUseCase(gateway);
        await orderRepository.save(order);

        const response = await createPaymentRoute(request({ orderId: "order-1" }), useCase, "customer-2");

        expect(response.status).toBe(403);
        expect(await response.json()).toEqual({ error: "این سفارش متعلق به حساب کاربری شما نیست." });
    });

    it("keeps the API lifecycle retryable after a gateway failure", async () => {
        let initiateCalls = 0;
        const gateway: PaymentGateway = {
            name: "test",
            async initiate() {
                initiateCalls += 1;
                if (initiateCalls === 1) throw new Error("gateway unavailable");
                return { authority: "AUTH-2", paymentUrl: "https://pay.test/AUTH-2" };
            },
            async verify() { return { referenceId: "REF-2" }; },
        };
        const { orderRepository, paymentRepository, useCase } = buildUseCase(gateway);
        await orderRepository.save(order);

        const failed = await createPaymentRoute(request({ orderId: "order-1" }), useCase, "customer-1");
        const retried = await createPaymentRoute(request({ orderId: "order-1" }), useCase, "customer-1");
        const payment = await paymentRepository.findLatestByOrderId("order-1");

        expect(failed.status).toBe(400);
        expect(await failed.json()).toEqual({ error: "gateway unavailable" });
        expect(retried.status).toBe(201);
        expect(payment?.paymentId).toBe("payment-1");
        expect(payment?.status).toBe("initiated");
        expect(initiateCalls).toBe(2);
    });

    it("returns 409 for the losing concurrent retry", async () => {
        let releaseGateway!: () => void;
        let signalGatewayEntered!: () => void;
        const gatewayEntered = new Promise<void>((resolve) => {
            signalGatewayEntered = resolve;
        });
        const gatewayStarted = new Promise<void>((resolve) => {
            releaseGateway = resolve;
        });
        let initiateCalls = 0;
        const gateway: PaymentGateway = {
            name: "test",
            async initiate() {
                initiateCalls += 1;
                signalGatewayEntered();
                await gatewayStarted;
                return { authority: "AUTH-RETRY", paymentUrl: "https://pay.test/AUTH-RETRY" };
            },
            async verify() { return { referenceId: "REF-RETRY" }; },
        };
        const { orderRepository, paymentRepository, useCase } = buildUseCase(gateway);
        await orderRepository.save(order);
        await paymentRepository.save({
            paymentId: "payment-1",
            orderId: "order-1",
            amount: 5000000,
            status: "failed",
            gateway: "test",
            authority: "STALE-AUTH",
            referenceId: "STALE-REF",
            createdAt: "2026-09-09T10:01:00.000Z",
            updatedAt: "2026-09-09T10:01:00.000Z",
        });

        const firstPromise = createPaymentRoute(request({ orderId: "order-1" }), useCase, "customer-1");
        await gatewayEntered;
        const second = await createPaymentRoute(request({ orderId: "order-1" }), useCase, "customer-1");
        releaseGateway();
        const first = await firstPromise;
        const payment = await paymentRepository.findById("payment-1");

        expect(first.status).toBe(201);
        expect(second.status).toBe(409);
        expect(await second.json()).toEqual({ error: "برای این سفارش یک پرداخت فعال وجود دارد." });
        expect(payment?.status).toBe("initiated");
        expect(initiateCalls).toBe(1);
    });
});
