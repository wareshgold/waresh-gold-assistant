import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

const UPSTREAM_TIMEOUT_MS = 10_000;
const COOKIE_NAME = "waresh_admin_session";

export async function GET() {
  const token = (await cookies()).get(COOKIE_NAME)?.value?.trim() ?? "";
  if (!token) return NextResponse.json({ error: "احراز هویت ادمین لازم است." }, { status: 401 });

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/orders`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    const payload = await response.json().catch(() => ({ error: "دریافت سفارش‌ها انجام نشد." }));
    return NextResponse.json(payload, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "ارتباط با سرویس سفارش برقرار نشد." }, { status: 502 });
  }
}
