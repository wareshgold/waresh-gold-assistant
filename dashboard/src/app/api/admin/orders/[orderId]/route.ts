import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

const UPSTREAM_TIMEOUT_MS = 10_000;
const COOKIE_NAME = "waresh_admin_session";

async function getToken() {
  return (await cookies()).get(COOKIE_NAME)?.value?.trim() ?? "";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const token = await getToken();
  const { orderId } = await params;
  const normalizedOrderId = orderId?.trim();
  if (!token) return NextResponse.json({ error: "احراز هویت ادمین لازم است." }, { status: 401 });
  if (!normalizedOrderId) return NextResponse.json({ error: "شناسه سفارش الزامی است." }, { status: 400 });

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/orders/${encodeURIComponent(normalizedOrderId)}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    const payload = await response.json().catch(() => ({ error: "دریافت سفارش انجام نشد." }));
    return NextResponse.json(payload, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "ارتباط با سرویس سفارش برقرار نشد." }, { status: 502 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const token = await getToken();
  const { orderId } = await params;
  const normalizedOrderId = orderId?.trim();
  if (!token) return NextResponse.json({ error: "احراز هویت ادمین لازم است." }, { status: 401 });
  if (!normalizedOrderId) return NextResponse.json({ error: "شناسه سفارش الزامی است." }, { status: 400 });

  const body = await request.json().catch(() => null);
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/orders/${encodeURIComponent(normalizedOrderId)}/status`, {
      method: "POST",
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    const payload = await response.json().catch(() => ({ error: "تغییر وضعیت سفارش انجام نشد." }));
    return NextResponse.json(payload, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "ارتباط با سرویس سفارش برقرار نشد." }, { status: 502 });
  }
}
