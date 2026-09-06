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

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error("دریافت محصول ناموفق بود.");
    }

    return (await response.json()) as CatalogProduct;
}
