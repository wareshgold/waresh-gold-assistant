import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

const MAX_BODY_BYTES = 16 * 1024;
const UPSTREAM_TIMEOUT_MS = 10_000;

export const dynamic = "force-dynamic";

type RouteContext = {
    params: Promise<{ paymentId: string }>;
};

async function proxyVerification(paymentId: string, authority: string) {
    if (!paymentId) {
        return NextResponse.json(
            { error: "شناسه پرداخت الزامی است." },
            { status: 400, headers: { "Cache-Control": "no-store" } },
        );
    }

    if (!authority) {
        return NextResponse.json(
            { error: "شناسه تراکنش درگاه الزامی است." },
            { status: 400, headers: { "Cache-Control": "no-store" } },
        );
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/payments/${encodeURIComponent(paymentId)}/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ authority }),
            cache: "no-store",
            signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        });
        const data = await response.json().catch(() => null);

        return NextResponse.json(
            data ?? { error: "تأیید پرداخت انجام نشد." },
            {
                status: response.status,
                headers: { "Cache-Control": "no-store" },
            },
        );
    } catch {
        return NextResponse.json(
            { error: "ارتباط با سرویس پرداخت برقرار نشد." },
            { status: 503, headers: { "Cache-Control": "no-store" } },
        );
    }
}

export async function POST(request: Request, context: RouteContext) {
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

    const authority = body && typeof body === "object" && !Array.isArray(body) && typeof (body as Record<string, unknown>).authority === "string"
        ? (body as Record<string, unknown>).authority.trim()
        : "";
    const { paymentId } = await context.params;
    return proxyVerification(paymentId.trim(), authority);
}

export async function GET(request: Request, context: RouteContext) {
    const authority = new URL(request.url).searchParams.get("authority")?.trim() ?? "";
    const { paymentId } = await context.params;
    return proxyVerification(paymentId.trim(), authority);
}
