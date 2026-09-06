import { NextResponse } from "next/server";

const BACKEND_URL =
    process.env.WARESH_BACKEND_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "https://waresh-gold-assistant.wareshgold.workers.dev";

type BackendProduct = Record<string, unknown>;

type CatalogResponse = {
    items?: BackendProduct[];
};

export async function GET() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/catalog/products`, {
            cache: "no-store",
        });

        const payload = (await response.json()) as CatalogResponse;

        if (!response.ok) {
            return NextResponse.json(
                { error: "دریافت فهرست محصولات از سرویس اصلی ناموفق بود." },
                { status: response.status },
            );
        }

        return NextResponse.json({ products: Array.isArray(payload.items) ? payload.items : [] });
    } catch {
        return NextResponse.json(
            { error: "سرویس کاتالوگ در دسترس نیست." },
            { status: 502 },
        );
    }
}
