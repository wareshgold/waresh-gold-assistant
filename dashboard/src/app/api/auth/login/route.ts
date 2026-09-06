import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

const MAX_BODY_BYTES = 8 * 1024;
const UPSTREAM_TIMEOUT_MS = 10_000;
const SESSION_COOKIE = "waresh_customer_session";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) return NextResponse.json({ error: "حجم درخواست بیش از حد مجاز است." }, { status: 413 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 });
  const input = body as Record<string, unknown>;
  if (typeof input.username !== "string" || typeof input.password !== "string") return NextResponse.json({ error: "نام کاربری و رمز عبور الزامی است." }, { status: 400 });

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: input.username, password: input.password }),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    const data = await response.json().catch(() => null) as any;
    if (!response.ok || !data?.sessionId) return NextResponse.json(data ?? { error: "ورود انجام نشد." }, { status: response.status || 401, headers: { "Cache-Control": "no-store" } });

    const next = NextResponse.json({ customer: data.customer }, { headers: { "Cache-Control": "no-store" } });
    next.cookies.set(SESSION_COOKIE, data.sessionId, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
    return next;
  } catch {
    return NextResponse.json({ error: "ارتباط با سرویس حساب کاربری برقرار نشد." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
