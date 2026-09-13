import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

const UPSTREAM_TIMEOUT_MS = 10_000;

export async function DELETE(_request: Request, context: { params: Promise<{ productId: string }> }) {
  try {
    const sessionId = (await cookies()).get("waresh_customer_session")?.value;
    if (!sessionId) return NextResponse.json({ error: "احراز هویت لازم است." }, { status: 401 });
    const { productId } = await context.params;
    const response = await fetch(`${API_BASE_URL}/api/v1/account/wishlist/${encodeURIComponent(productId)}`, {
      method: "DELETE",
      cache: "no-store",
      headers: { "X-Customer-Session": sessionId },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    const payload = await response.json().catch(() => ({ error: "حذف از علاقه‌مندی‌ها انجام نشد." }));
    return NextResponse.json(payload, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "ارتباط با سرویس علاقه‌مندی‌ها برقرار نشد." }, { status: 502 });
  }
}
