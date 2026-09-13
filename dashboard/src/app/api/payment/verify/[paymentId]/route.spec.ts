import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();

vi.mock("@/lib/api", () => ({
    API_BASE_URL: "https://api.example.test",
}));

import { GET, POST } from "./route";

const context = (paymentId: string) => ({ params: Promise.resolve({ paymentId }) });

function request(body: unknown) {
    return new Request("https://site.test/api/payment/verify/payment-1", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "content-type": "application/json" },
    });
}

describe("payment verification proxy", () => {
    beforeEach(() => {
        vi.stubGlobal("fetch", fetchMock);
        fetchMock.mockReset();
    });

    it("forwards payment id and authority to the backend", async () => {
        fetchMock.mockResolvedValue(new Response(JSON.stringify({ payment: { paymentId: "payment-1", status: "paid" } }), {
            status: 200,
            headers: { "content-type": "application/json" },
        }));

        const response = await POST(request({ authority: "AUTH-1", paymentId: "attacker" }), context("payment-1"));

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ payment: { paymentId: "payment-1", status: "paid" } });
        expect(fetchMock).toHaveBeenCalledWith(
            "https://api.example.test/api/v1/payments/payment-1/verify",
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify({ authority: "AUTH-1" }),
            }),
        );
    });

    it("supports gateway GET callbacks with the authority query parameter", async () => {
        fetchMock.mockResolvedValue(new Response(JSON.stringify({ payment: { status: "paid" } }), {
            status: 200,
            headers: { "content-type": "application/json" },
        }));

        const response = await GET(
            new Request("https://site.test/api/payment/verify/payment-1?authority=AUTH-GET"),
            context("payment-1"),
        );

        expect(response.status).toBe(200);
        expect(fetchMock).toHaveBeenCalledWith(
            "https://api.example.test/api/v1/payments/payment-1/verify",
            expect.objectContaining({ body: JSON.stringify({ authority: "AUTH-GET" }) }),
        );
    });

    it("rejects a missing authority before calling the backend", async () => {
        const response = await POST(request({}), context("payment-1"));

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: "شناسه تراکنش درگاه الزامی است." });
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("preserves backend verification errors", async () => {
        fetchMock.mockResolvedValue(new Response(JSON.stringify({ error: "شناسه پرداخت معتبر نیست." }), {
            status: 400,
            headers: { "content-type": "application/json" },
        }));

        const response = await POST(request({ authority: "WRONG" }), context("payment-1"));

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: "شناسه پرداخت معتبر نیست." });
        expect(response.headers.get("Cache-Control")).toBe("no-store");
    });

    it("returns 503 when the backend is unavailable", async () => {
        fetchMock.mockRejectedValue(new Error("upstream unavailable"));

        const response = await POST(request({ authority: "AUTH-1" }), context("payment-1"));

        expect(response.status).toBe(503);
        expect(await response.json()).toEqual({ error: "ارتباط با سرویس پرداخت برقرار نشد." });
    });
});
