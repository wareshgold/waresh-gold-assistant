import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

const UPSTREAM_TIMEOUT_MS = 10_000;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;
    const normalizedOrderId = orderId?.trim();

    if (!normalizedOrderId) {
      return NextResponse.json({ error: "شناسه سفارش الزامی است." }, { status: 400 });
    }

    const sessionId = (await cookies()).get("waresh_customer_session")?.value;
    const headers: HeadersInit = {};
    if (sessionId) headers["X-Customer-Session"] = sessionId;

    const response = await fetch(
      `${API_BASE_URL}/api/v1/orders/${encodeURIComponent(normalizedOrderId)}`,
      {
        cache: "no-store",
        headers,
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      },
    );

    const payload = await response.json().catch(() => ({ error: "دریافت سفارش انجام نشد." }));

    return NextResponse.json(payload, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "ارتباط با سرویس سفارش برقرار نشد." }, { status: 502 });
  }
}
