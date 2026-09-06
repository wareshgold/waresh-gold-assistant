import { NextResponse } from "next/server";

const BACKEND_URL = process.env.WARESH_BACKEND_URL ?? "http://localhost:8787";

type BackendProduct = Record<string, unknown>;

type CatalogResponse = {
    products?: BackendProduct[];
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

        return NextResponse.json(payload);
    } catch {
        return NextResponse.json(
            { error: "سرویس کاتالوگ در دسترس نیست." },
            { status: 502 },
        );
    }
}
