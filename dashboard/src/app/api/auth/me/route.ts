import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api";

const SESSION_COOKIE = "waresh_customer_session";
const UPSTREAM_TIMEOUT_MS = 10_000;

export const dynamic = "force-dynamic";

export async function GET() {
  const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionId) return NextResponse.json({ error: "احراز هویت لازم است." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: { "X-Customer-Session": sessionId },
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    const data = await response.json().catch(() => null);
    return NextResponse.json(data ?? { error: "پاسخ حساب کاربری نامعتبر است." }, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "ارتباط با سرویس حساب کاربری برقرار نشد." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
