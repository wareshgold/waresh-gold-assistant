import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

const MAX_BODY_BYTES = 32 * 1024;
const UPSTREAM_TIMEOUT_MS = 10_000;

export const dynamic = "force-dynamic";

const proxyResponse = async (response: Response) => {
  const data = await response.json().catch(() => null);
  return NextResponse.json(
    data ?? { error: "دریافت پیش‌فاکتور انجام نشد." },
    {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    },
  );
};

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

    return proxyResponse(response);
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

export async function GET(request: NextRequest) {
  const quoteId = request.nextUrl.searchParams.get("quoteId")?.trim();

  if (!quoteId) {
    return NextResponse.json(
      { error: "شناسه پیش‌فاکتور الزامی است." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/checkout/quote/${encodeURIComponent(quoteId)}`,
      {
        method: "GET",
        cache: "no-store",
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      },
    );

    return proxyResponse(response);
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
