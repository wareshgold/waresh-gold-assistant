import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

export async function GET() {
    try {
        const sessionId = (await cookies()).get("waresh_customer_session")?.value;
        if (!sessionId) return NextResponse.json({ error: "برای مشاهده سفارش‌ها وارد حساب شوید." }, { status: 401 });

        const response = await fetch(`${API_BASE_URL}/api/v1/orders`, {
            cache: "no-store",
            headers: { "X-Customer-Session": sessionId },
        });
        const payload = await response.json().catch(() => ({ error: "دریافت سفارش‌ها انجام نشد." }));
        return NextResponse.json(payload, { status: response.status, headers: { "Cache-Control": "no-store" } });
    } catch {
        return NextResponse.json({ error: "ارتباط با سرویس سفارش برقرار نشد." }, { status: 502 });
    }
}
