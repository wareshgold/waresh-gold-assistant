import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

const UPSTREAM_TIMEOUT_MS = 10_000;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const quoteId = typeof body?.quoteId === "string" ? body.quoteId.trim() : "";
        const addressId = typeof body?.addressId === "string" ? body.addressId.trim() : "";

        if (!quoteId) return NextResponse.json({ error: "شناسه پیش‌فاکتور الزامی است." }, { status: 400 });

        const sessionId = (await cookies()).get("waresh_customer_session")?.value;
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (sessionId) headers["X-Customer-Session"] = sessionId;

        const response = await fetch(`${API_BASE_URL}/api/v1/orders/from-quote`, {
            method: "POST",
            headers,
            body: JSON.stringify({ quoteId, ...(addressId ? { addressId } : {}) }),
            cache: "no-store",
            signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        });

        const payload = await response.json().catch(() => ({ error: "ثبت سفارش انجام نشد." }));
        return NextResponse.json(payload, {
            status: response.status,
            headers: { "Cache-Control": "no-store" },
        });
    } catch {
        return NextResponse.json({ error: "ارتباط با سرویس سفارش برقرار نشد." }, { status: 502 });
    }
}
