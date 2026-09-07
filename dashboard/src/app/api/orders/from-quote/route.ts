import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const response = await fetch(`${getApiBaseUrl()}/api/v1/orders/from-quote`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quoteId: body?.quoteId }),
            cache: "no-store",
        });

        const payload = await response.json().catch(() => ({ error: "ثبت سفارش انجام نشد." }));
        return NextResponse.json(payload, { status: response.status, headers: { "Cache-Control": "no-store" } });
    } catch {
        return NextResponse.json({ error: "ارتباط با سرویس سفارش برقرار نشد." }, { status: 502 });
    }
}
