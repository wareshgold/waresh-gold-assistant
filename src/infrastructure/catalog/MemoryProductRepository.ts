import type { Product } from "../../domain/catalog/entities/Product";
import type { ProductRepository } from "../../domain/catalog/repositories/ProductRepository";

const PRODUCTS: Product[] = [
    [1, "انگشتر ساده مخصوص هدیه", "اقتصادی", "انگشتر", 1.2, 3, 7],
    [2, "گوشواره میخی مخصوص هدیه", "اقتصادی", "گوشواره", 0.8, 4, 7],
    [3, "پلاک کوچک مخصوص هدیه", "اقتصادی", "آویز", 0.5, 5, 7],
    [4, "انگشتر نگین‌دار", "انگشتر", null, 2.5, 6, 7],
    [5, "انگشتر حلقه‌ای", "انگشتر", null, 1.8, 5, 7],
    [6, "انگشتر مردانه", "مردانه", null, 4.2, 7, 7],
    [7, "آویز قلب", "آویز", null, 1.5, 8, 7],
    [8, "آویز ستاره", "آویز", null, 1.2, 6, 7],
    [9, "النگو ساده", "النگو", null, 15.5, 4, 7],
    [10, "النگو طرح‌دار", "النگو", null, 18.2, 9, 7],
    [11, "گوشواره آویزی", "گوشواره", null, 1.8, 8, 7],
    [12, "گوشواره میخی", "گوشواره", null, 0.9, 5, 7],
    [13, "گردنبند زنجیری", "گردنبند", null, 5.5, 6, 7],
    [14, "گردنبند با پلاک", "گردنبند", null, 3.2, 7, 7],
    [15, "دستبند زنجیری", "دستبند", null, 4.5, 6, 7],
    [16, "دستبند النگویی", "دستبند", null, 8.2, 7, 7],
    [17, "انگشتر مردانه ساده", "مردانه", null, 5.8, 5, 7],
    [18, "زنجیر مردانه", "مردانه", null, 12.5, 10, 7],
    [19, "دستبند چرم مشکی مخصوص هدیه", "اقتصادی", "دستبند", 0.24, 2, 7],
    [20, "دستبند چرم قهوه‌ای مخصوص هدیه", "اقتصادی", "دستبند", 0.28, 2, 7],
    [21, "دستبند چرم مینیمال مخصوص هدیه", "اقتصادی", "دستبند", 0.32, 3, 7],
    [22, "دستبند چرم باریک مخصوص هدیه", "اقتصادی", "دستبند", 0.35, 3, 7],
].map(([id, name, category, subcategory, weight, labor, profit]) => ({
    productId: String(id),
    sku: `WG-${String(id).padStart(4, "0")}`,
    name,
    category,
    subcategory,
    weightGrams: weight,
    karat: 18,
    laborPercent: labor,
    profitPercent: profit,
    taxPercent: 0,
    stockStatus: "in-stock",
    active: true,
    createdAt: "2026-09-06T00:00:00.000Z",
    updatedAt: "2026-09-06T00:00:00.000Z",
}));

export class MemoryProductRepository implements ProductRepository {
    async listActive(): Promise<Product[]> {
        return PRODUCTS.filter((product) => product.active).map((product) => ({ ...product }));
    }

    async findById(productId: string): Promise<Product | null> {
        const product = PRODUCTS.find((item) => item.active && item.productId === productId);
        return product ? { ...product } : null;
    }
}