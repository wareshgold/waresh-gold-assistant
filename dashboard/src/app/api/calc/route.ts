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

  const input = body as Record<string, unknown>;

  // Optional percentages are normalized here so the Website API remains
  // compatible with the core calculator contract even when the upstream
  // Worker has not yet been updated to accept omitted fields.
  const normalizedBody = {
    ...input,
    laborPercent: input.laborPercent ?? 0,
    profitPercent: input.profitPercent ?? 0,
    taxPercent: input.taxPercent ?? 0,
    discount: input.discount ?? 0,
  };

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/calculate/gold-price`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalizedBody),
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        data ?? { error: "خطا در محاسبه. دوباره تلاش کنید." },
        {
          status: response.status,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "ارتباط با سرویس محاسبه برقرار نشد." },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
