import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

const SESSION_COOKIE = "waresh_customer_session";
const UPSTREAM_TIMEOUT_MS = 10_000;

export async function PATCH(_request: Request, context: { params: Promise<{ addressId: string }> }) {
  const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionId) return NextResponse.json({ error: "احراز هویت لازم است." }, { status: 401 });

  const { addressId } = await context.params;
  if (!addressId?.trim()) return NextResponse.json({ error: "شناسه آدرس الزامی است." }, { status: 400 });

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/account/addresses/${encodeURIComponent(addressId)}/default`, {
      method: "PATCH",
      headers: { "X-Customer-Session": sessionId },
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    const payload = await response.json().catch(() => ({ error: "انتخاب آدرس پیش‌فرض انجام نشد." }));
    return NextResponse.json(payload, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "ارتباط با سرویس آدرس برقرار نشد." }, { status: 503 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ addressId: string }> }) {
  const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionId) return NextResponse.json({ error: "احراز هویت لازم است." }, { status: 401 });

  const { addressId } = await context.params;
  if (!addressId?.trim()) return NextResponse.json({ error: "شناسه آدرس الزامی است." }, { status: 400 });

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/account/addresses/${encodeURIComponent(addressId)}`, {
      method: "DELETE",
      headers: { "X-Customer-Session": sessionId },
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    const payload = await response.json().catch(() => ({ error: "حذف آدرس انجام نشد." }));
    return NextResponse.json(payload, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "ارتباط با سرویس آدرس برقرار نشد." }, { status: 503 });
  }
}
