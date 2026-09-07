import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

const MAX_BODY_BYTES = 32 * 1024;
const UPSTREAM_TIMEOUT_MS = 10_000;

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const contentLength = request.headers.get("content-length");

  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "حجم درخواست بیش از حد مجاز است." },
      { status: 413 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "درخواست نامعتبر است." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { error: "درخواست نامعتبر است." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/checkout/quote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        data ?? { error: "آماده‌سازی سفارش انجام نشد." },
        {
          status: response.status,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "ارتباط با سرویس سفارش برقرار نشد." },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
