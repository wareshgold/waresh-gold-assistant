import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "درخواست نامعتبر است." },
      { status: 400 }
    );
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/calculate/gold-price`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return NextResponse.json(
      data ?? { error: "خطا در محاسبه. دوباره تلاش کنید." },
      { status: response.status }
    );
  }

  return NextResponse.json(data);
}
