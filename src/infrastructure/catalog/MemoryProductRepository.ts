import type { Product } from "../../domain/catalog/entities/Product";
import type { ProductRepository } from "../../domain/catalog/repositories/ProductRepository";

type ProductSeed = {
    id: number;
    name: string;
    category: string;
    subcategory: string | null;
    weightGrams: number;
    laborPercent: number;
    profitPercent: number;
};

const PRODUCT_SEEDS: ProductSeed[] = [
    { id: 1, name: "انگشتر ساده مخصوص هدیه", category: "اقتصادی", subcategory: "انگشتر", weightGrams: 1.2, laborPercent: 3, profitPercent: 7 },
    { id: 2, name: "گوشواره میخی مخصوص هدیه", category: "اقتصادی", subcategory: "گوشواره", weightGrams: 0.8, laborPercent: 4, profitPercent: 7 },
    { id: 3, name: "پلاک کوچک مخصوص هدیه", category: "اقتصادی", subcategory: "آویز", weightGrams: 0.5, laborPercent: 5, profitPercent: 7 },
    { id: 4, name: "انگشتر نگین‌دار", category: "انگشتر", subcategory: null, weightGrams: 2.5, laborPercent: 6, profitPercent: 7 },
    { id: 5, name: "انگشتر حلقه‌ای", category: "انگشتر", subcategory: null, weightGrams: 1.8, laborPercent: 5, profitPercent: 7 },
    { id: 6, name: "انگشتر مردانه", category: "مردانه", subcategory: null, weightGrams: 4.2, laborPercent: 7, profitPercent: 7 },
    { id: 7, name: "آویز قلب", category: "آویز", subcategory: null, weightGrams: 1.5, laborPercent: 8, profitPercent: 7 },
    { id: 8, name: "آویز ستاره", category: "آویز", subcategory: null, weightGrams: 1.2, laborPercent: 6, profitPercent: 7 },
    { id: 9, name: "النگو ساده", category: "النگو", subcategory: null, weightGrams: 15.5, laborPercent: 4, profitPercent: 7 },
    { id: 10, name: "النگو طرح‌دار", category: "النگو", subcategory: null, weightGrams: 18.2, laborPercent: 9, profitPercent: 7 },
    { id: 11, name: "گوشواره آویزی", category: "گوشواره", subcategory: null, weightGrams: 1.8, laborPercent: 8, profitPercent: 7 },
    { id: 12, name: "گوشواره میخی", category: "گوشواره", subcategory: null, weightGrams: 0.9, laborPercent: 5, profitPercent: 7 },
    { id: 13, name: "گردنبند زنجیری", category: "گردنبند", subcategory: null, weightGrams: 5.5, laborPercent: 6, profitPercent: 7 },
    { id: 14, name: "گردنبند با پلاک", category: "گردنبند", subcategory: null, weightGrams: 3.2, laborPercent: 7, profitPercent: 7 },
    { id: 15, name: "دستبند زنجیری", category: "دستبند", subcategory: null, weightGrams: 4.5, laborPercent: 6, profitPercent: 7 },
    { id: 16, name: "دستبند النگویی", category: "دستبند", subcategory: null, weightGrams: 8.2, laborPercent: 7, profitPercent: 7 },
    { id: 17, name: "انگشتر مردانه ساده", category: "مردانه", subcategory: null, weightGrams: 5.8, laborPercent: 5, profitPercent: 7 },
    { id: 18, name: "زنجیر مردانه", category: "مردانه", subcategory: null, weightGrams: 12.5, laborPercent: 10, profitPercent: 7 },
    { id: 19, name: "دستبند چرم مشکی مخصوص هدیه", category: "اقتصادی", subcategory: "دستبند", weightGrams: 0.24, laborPercent: 2, profitPercent: 7 },
    { id: 20, name: "دستبند چرم قهوه‌ای مخصوص هدیه", category: "اقتصادی", subcategory: "دستبند", weightGrams: 0.28, laborPercent: 2, profitPercent: 7 },
    { id: 21, name: "دستبند چرم مینیمال مخصوص هدیه", category: "اقتصادی", subcategory: "دستبند", weightGrams: 0.32, laborPercent: 3, profitPercent: 7 },
    { id: 22, name: "دستبند چرم باریک مخصوص هدیه", category: "اقتصادی", subcategory: "دستبند", weightGrams: 0.35, laborPercent: 3, profitPercent: 7 },
];

const PRODUCTS: Product[] = PRODUCT_SEEDS.map((seed) => ({
    productId: String(seed.id),
    sku: `WG-${String(seed.id).padStart(4, "0")}`,
    name: seed.name,
    category: seed.category,
    subcategory: seed.subcategory,
    weightGrams: seed.weightGrams,
    karat: 18,
    laborPercent: seed.laborPercent,
    profitPercent: seed.profitPercent,
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
