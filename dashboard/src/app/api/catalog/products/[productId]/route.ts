import { NextResponse } from "next/server";

const BACKEND_URL = process.env.WARESH_BACKEND_URL ?? "http://localhost:8787";

type BackendProduct = Record<string, unknown>;

type RouteContext = {
    params: Promise<{ productId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
    const { productId } = await context.params;

    try {
        const response = await fetch(
            `${BACKEND_URL}/api/v1/catalog/products/${encodeURIComponent(productId)}`,
            { cache: "no-store" },
        );

        if (response.status === 404) {
            return NextResponse.json({ error: "محصول پیدا نشد." }, { status: 404 });
        }

        const payload = (await response.json()) as BackendProduct;

        if (!response.ok) {
            return NextResponse.json(
                { error: "دریافت محصول از سرویس اصلی ناموفق بود." },
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
