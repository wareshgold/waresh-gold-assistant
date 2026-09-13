import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

const UPSTREAM_TIMEOUT_MS = 10_000;

export async function GET() {
  try {
    const sessionId = (await cookies()).get("waresh_customer_session")?.value;
    if (!sessionId) return NextResponse.json({ error: "احراز هویت لازم است." }, { status: 401 });
    const response = await fetch(`${API_BASE_URL}/api/v1/account/wishlist`, {
      cache: "no-store",
      headers: { "X-Customer-Session": sessionId },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    const payload = await response.json().catch(() => ({ error: "دریافت علاقه‌مندی‌ها انجام نشد." }));
    return NextResponse.json(payload, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "ارتباط با سرویس علاقه‌مندی‌ها برقرار نشد." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  try {
    const sessionId = (await cookies()).get("waresh_customer_session")?.value;
    if (!sessionId) return NextResponse.json({ error: "احراز هویت لازم است." }, { status: 401 });
    const body = await request.json().catch(() => null);
    const productId = body && typeof body === "object" && !Array.isArray(body) && typeof (body as Record<string, unknown>).productId === "string"
      ? ((body as Record<string, unknown>).productId as string)
      : "";
    const response = await fetch(`${API_BASE_URL}/api/v1/account/wishlist`, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json", "X-Customer-Session": sessionId },
      body: JSON.stringify({ productId }),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    const payload = await response.json().catch(() => ({ error: "افزودن به علاقه‌مندی‌ها انجام نشد." }));
    return NextResponse.json(payload, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "ارتباط با سرویس علاقه‌مندی‌ها برقرار نشد." }, { status: 502 });
  }
}
