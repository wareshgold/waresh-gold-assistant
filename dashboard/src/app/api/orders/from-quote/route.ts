import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const quoteId = typeof body?.quoteId === "string" ? body.quoteId.trim() : "";

        if (!quoteId) {
            return NextResponse.json({ error: "شناسه پیش‌فاکتور الزامی است." }, { status: 400 });
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/orders/from-quote`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quoteId }),
            cache: "no-store",
        });

        const payload = await response.json().catch(() => ({ error: "ثبت سفارش انجام نشد." }));
        return NextResponse.json(payload, {
            status: response.status,
            headers: { "Cache-Control": "no-store" },
        });
    } catch {
        return NextResponse.json({ error: "ارتباط با سرویس سفارش برقرار نشد." }, { status: 502 });
    }
}
