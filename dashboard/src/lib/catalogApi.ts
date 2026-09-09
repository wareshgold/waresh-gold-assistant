export type CatalogProduct = {
    productId: string;
    sku: string;
    name: string;
    category: string;
    subcategory: string | null;
    weightGrams: number;
    karat: 18 | 24;
    laborPercent: number;
    profitPercent: number;
    taxPercent: number;
    stockStatus: "in-stock" | "limited" | "out-of-stock";
    active: boolean;
    createdAt: string;
    updatedAt: string;
};

type CatalogResponse = {
    items?: CatalogProduct[];
};

const BACKEND_URL =
    process.env.WARESH_BACKEND_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "https://waresh-gold-assistant.wareshgold.workers.dev";

export async function fetchCatalogProducts(): Promise<CatalogProduct[]> {
    const response = await fetch("/api/catalog/products", {
        method: "GET",
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("دریافت فهرست محصولات ناموفق بود.");
    }

    const payload = (await response.json()) as { products?: CatalogProduct[] };
    return Array.isArray(payload.products) ? payload.products : [];
}

export async function fetchCatalogProduct(productId: string): Promise<CatalogProduct | null> {
    const response = await fetch(`/api/catalog/products/${encodeURIComponent(productId)}`, {
        method: "GET",
        cache: "no-store",
    });

    if (response.status === 404) return null;
    if (!response.ok) throw new Error("دریافت محصول ناموفق بود.");

    return (await response.json()) as CatalogProduct;
}

export async function fetchCatalogProductsServer(): Promise<CatalogProduct[]> {
    const response = await fetch(`${BACKEND_URL}/api/v1/catalog/products`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("دریافت فهرست محصولات از سرویس اصلی ناموفق بود.");
    }

    const payload = (await response.json()) as CatalogResponse;
    return Array.isArray(payload.items) ? payload.items : [];
}

export async function fetchCatalogProductServer(productId: string): Promise<CatalogProduct | null> {
    const response = await fetch(
        `${BACKEND_URL}/api/v1/catalog/products/${encodeURIComponent(productId)}`,
        { cache: "no-store" },
    );

    if (response.status === 404) return null;
    if (!response.ok) throw new Error("دریافت محصول از سرویس اصلی ناموفق بود.");

    return (await response.json()) as CatalogProduct;
}
