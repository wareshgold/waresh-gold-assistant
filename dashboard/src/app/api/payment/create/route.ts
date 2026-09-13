import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

const MAX_BODY_BYTES = 32 * 1024;
const UPSTREAM_TIMEOUT_MS = 10_000;

export const dynamic = "force-dynamic";

async function proxyResponse(response: Response) {
    const data = await response.json().catch(() => null);
    return NextResponse.json(
        data ?? { error: "ایجاد پرداخت انجام نشد." },
        {
            status: response.status,
            headers: { "Cache-Control": "no-store" },
        },
    );
}

export async function POST(request: Request) {
    const contentLength = request.headers.get("content-length");
    if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
        return NextResponse.json(
            { error: "حجم درخواست بیش از حد مجاز است." },
            { status: 413, headers: { "Cache-Control": "no-store" } },
        );
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "درخواست نامعتبر است." },
            { status: 400, headers: { "Cache-Control": "no-store" } },
        );
    }

    const bodyRecord = body && typeof body === "object" && !Array.isArray(body)
        ? body as Record<string, unknown>
        : null;
    const orderIdValue = bodyRecord?.orderId;
    const orderId = typeof orderIdValue === "string"
        ? orderIdValue.trim()
        : "";

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
        const response = await fetch(`${API_BASE_URL}/api/v1/payments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Customer-Session": sessionId,
            },
            body: JSON.stringify({ orderId }),
            cache: "no-store",
            signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        });

        return proxyResponse(response);
    } catch {
        return NextResponse.json(
            { error: "ارتباط با سرویس پرداخت برقرار نشد." },
            { status: 503, headers: { "Cache-Control": "no-store" } },
        );
    }
}
