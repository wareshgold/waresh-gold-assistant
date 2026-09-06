export type ProductStockStatus = "in-stock" | "limited" | "out-of-stock";

export type Product = {
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
    stockStatus: ProductStockStatus;
    active: boolean;
    createdAt: string;
    updatedAt: string;
};