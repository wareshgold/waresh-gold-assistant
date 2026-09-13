import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

const UPSTREAM_TIMEOUT_MS = 10_000;

export const dynamic = "force-dynamic";

export async function POST(_request: Request, context: { params: Promise<{ orderId: string }> }) {
    const orderId = (await context.params).orderId?.trim();
    if (!orderId) {
        return NextResponse.json(
            { error: "شناسه سفارش الزامی است." },
            { status: 400, headers: { "Cache-Control": "no-store" } },
        );
    }

    const sessionId = (await cookies()).get("waresh_customer_session")?.value;
    if (!sessionId) {
        return NextResponse.json(
            { error: "احراز هویت لازم است." },
            { status: 401, headers: { "Cache-Control": "no-store" } },
        );
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/orders/${encodeURIComponent(orderId)}/cancel`, {
            method: "POST",
            headers: { "X-Customer-Session": sessionId },
            cache: "no-store",
            signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        });
        const data = await response.json().catch(() => ({ error: "لغو سفارش انجام نشد." }));
        return NextResponse.json(data, {
            status: response.status,
            headers: { "Cache-Control": "no-store" },
        });
    } catch {
        return NextResponse.json(
            { error: "ارتباط با سرویس سفارش برقرار نشد." },
            { status: 503, headers: { "Cache-Control": "no-store" } },
        );
    }
}
