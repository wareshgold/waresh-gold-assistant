import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

const SESSION_COOKIE = "waresh_customer_session";
const UPSTREAM_TIMEOUT_MS = 10_000;

export const dynamic = "force-dynamic";

export async function GET() {
  const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionId) return NextResponse.json({ error: "احراز هویت لازم است." }, { status: 401, headers: { "Cache-Control": "no-store" } });

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/account/addresses`, {
      headers: { "X-Customer-Session": sessionId },
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    const payload = await response.json().catch(() => ({ error: "دریافت آدرس‌ها انجام نشد." }));
    return NextResponse.json(payload, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "ارتباط با سرویس آدرس برقرار نشد." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}

export async function POST(request: Request) {
  const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionId) return NextResponse.json({ error: "احراز هویت لازم است." }, { status: 401 });

  try {
    const body = await request.json();
    const response = await fetch(`${API_BASE_URL}/api/v1/account/addresses`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Customer-Session": sessionId },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    const payload = await response.json().catch(() => ({ error: "ثبت آدرس انجام نشد." }));
    return NextResponse.json(payload, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "ارتباط با سرویس آدرس برقرار نشد." }, { status: 503 });
  }
}
