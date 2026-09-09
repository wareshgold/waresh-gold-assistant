import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

const UPSTREAM_TIMEOUT_MS = 10_000;
const COOKIE_NAME = "waresh_admin_session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { token?: unknown } | null;
  const token = typeof body?.token === "string" ? body.token.trim() : "";

  if (!token) {
    return NextResponse.json({ error: "توکن ادمین الزامی است." }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/auth/check`, {
      method: "GET",
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    const payload = await response.json().catch(() => ({ error: "احراز هویت ادمین انجام نشد." }));
    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }

    const result = NextResponse.json({ ok: true }, { status: 200 });
    result.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return result;
  } catch {
    return NextResponse.json({ error: "ارتباط با سرویس ادمین برقرار نشد." }, { status: 502 });
  }
}

export async function DELETE() {
  const result = NextResponse.json({ ok: true }, { status: 200 });
  result.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return result;
}
