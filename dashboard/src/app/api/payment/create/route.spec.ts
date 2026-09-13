import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    fetchMock: vi.fn(),
    cookieMock: vi.fn(),
}));

vi.mock("next/headers", () => ({
    cookies: mocks.cookieMock,
}));

vi.mock("@/lib/api", () => ({
    API_BASE_URL: "https://api.example.test",
}));

import { POST } from "./route";

describe("POST /api/payment/create", () => {
    beforeEach(() => {
        vi.stubGlobal("fetch", mocks.fetchMock);
        mocks.fetchMock.mockReset();
        mocks.cookieMock.mockReset();
        mocks.cookieMock.mockResolvedValue({ get: vi.fn().mockReturnValue({ value: "session-1" }) });
    });

    it("requires the customer session", async () => {
        mocks.cookieMock.mockResolvedValue({ get: vi.fn().mockReturnValue(undefined) });

        const response = await POST(new Request("https://site.test/api/payment/create", {
            method: "POST",
            body: JSON.stringify({ orderId: "order-1" }),
            headers: { "content-type": "application/json" },
        }));

        expect(response.status).toBe(401);
        expect(await response.json()).toEqual({ error: "احراز هویت لازم است." });
        expect(mocks.fetchMock).not.toHaveBeenCalled();
    });

    it("forwards only the order id and customer session to the backend", async () => {
        mocks.fetchMock.mockResolvedValue(new Response(JSON.stringify({ payment: { paymentId: "payment-1" }, paymentUrl: "https://pay.test/1" }), {
            status: 201,
            headers: { "content-type": "application/json" },
        }));

        const response = await POST(new Request("https://site.test/api/payment/create", {
            method: "POST",
            body: JSON.stringify({ orderId: " order-1 ", amount: 999999999, customerId: "attacker" }),
            headers: { "content-type": "application/json" },
        }));

        expect(response.status).toBe(201);
        expect(await response.json()).toEqual({ payment: { paymentId: "payment-1" }, paymentUrl: "https://pay.test/1" });
        expect(mocks.fetchMock).toHaveBeenCalledWith(
            "https://api.example.test/api/v1/payments",
            expect.objectContaining({
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Customer-Session": "session-1",
                },
                body: JSON.stringify({ orderId: "order-1" }),
            }),
        );
    });

    it("preserves backend status and payload", async () => {
        mocks.fetchMock.mockResolvedValue(new Response(JSON.stringify({ error: "این سفارش قبلاً پرداخت شده است." }), {
            status: 409,
            headers: { "content-type": "application/json" },
        }));

        const response = await POST(new Request("https://site.test/api/payment/create", {
            method: "POST",
            body: JSON.stringify({ orderId: "order-1" }),
            headers: { "content-type": "application/json" },
        }));

        expect(response.status).toBe(409);
        expect(await response.json()).toEqual({ error: "این سفارش قبلاً پرداخت شده است." });
        expect(response.headers.get("Cache-Control")).toBe("no-store");
    });

    it("returns 503 when the backend is unavailable", async () => {
        mocks.fetchMock.mockRejectedValue(new Error("upstream unavailable"));

        const response = await POST(new Request("https://site.test/api/payment/create", {
            method: "POST",
            body: JSON.stringify({ orderId: "order-1" }),
            headers: { "content-type": "application/json" },
        }));

        expect(response.status).toBe(503);
        expect(await response.json()).toEqual({ error: "ارتباط با سرویس پرداخت برقرار نشد." });
    });
});
